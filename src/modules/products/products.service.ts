import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { CreateParsedProductDto } from './dto/create-parsed-product.dto';
import { Parser } from 'src/helpers/parser';
import { downloadImagesByUrl } from 'src/helpers/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IntegrationProduct } from '../../@types/integration.type';
import { CategoryService } from '../category/category.service';
import {
  getGoodsFrom1C,
  ParsedOptionsType,
  productRusFieldToEng,
} from './helper';
import { FavoriteService } from '../favorite/favorite.service';
import { SearchProductsQuery } from './dto/products.dto';

@Injectable()
export class ProductsService {
  private parser: Parser;

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private categoryService: CategoryService,
    private favoriteService: FavoriteService
  ) {
    this.parser = new Parser(this);
    this.parser.init();
  }

  async parse(productId: string) {
    try {
      const result = await this.parser.parseTrodat2(productId);
      console.log('Parsed data:', result);
      return result;
    } catch (error) {
      console.error('Error during parsing:', error);
      throw new InternalServerErrorException('Parsing error');
    }
  }

  async changeCategory(productId: string, categoryId: string) {
    const product = await this.productModel.findOne({ _id: productId });
    if (!product) throw new BadRequestException('Product not found');
    product.category = categoryId;
    await product.save();
    return product.populate('category');
  }

  async findByProductId(id: string): Promise<Product | null> {
    try {
      return await this.productModel.findOne({ product_id: id }).exec();
    } catch (e) {
      throw new BadRequestException('Given id invalid');
    }
  }

  async create(data): Promise<Product> {
    const product = new this.productModel(data);
    return await product.save();
  }

  async createParsedProduct(data: CreateParsedProductDto) {
    const existingProduct = await this.findByProductId(data.product_id);
    if (existingProduct) {
      console.log(
        `Product with ID ${data.product_id} already exists. Skipping creation.`
      );
      return;
    }
    await downloadImagesByUrl(data.images);
    data.is_active = false;
    await this.create(data);
  }

  async getProducts(userId?: string, query?: SearchProductsQuery) {
    const {
      categories,
      page = '1',
      limit = '10',
      sortBy = 'name',
      sortOrder = 'desc',
      search: searchQuery,
    } = query || {};

    // Prepare the search criteria if searchQuery is provided
    const searchCriteria = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { product1cId: { $regex: searchQuery, $options: 'i' } },
            { article: { $regex: searchQuery, $options: 'i' } },
            { description1c: { $regex: searchQuery, $options: 'i' } },
            { size: { $regex: searchQuery, $options: 'i' } },
          ],

          category: { $in: categories },
        }
      : {};

    // Prepare the sort criteria
    const sortCriteria = {};
    if (sortBy) {
      sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1; // Determine the sort order
    }

    // Create the products query with search and sorting
    const productTotal = await this.productModel.collection.count();

    const productsQuery = this.productModel
      .find(searchCriteria)
      .sort(sortCriteria)
      .lean(); // Use lean for better performance

    // Implement pagination
    const skip = (Number(page) - 1) * Number(limit);
    productsQuery.skip(skip).limit(Number(limit)); // Apply pagination

    // Execute the products query
    const products = await productsQuery.exec();

    // Get favorite product IDs if userId is provided
    const favoriteProductIds = userId
      ? await this.favoriteService.getFavorites(userId)
      : [];

    // Create a Set for faster lookup of favorite product IDs
    const favoriteSet = new Set(
      favoriteProductIds.map((fav) => fav?.product?._id?.toString())
    );

    // Combine products from MongoDB and 1C
    const goodsGetFrom1C = await getGoodsFrom1C();

    // Map products to include favorite status
    const combinedProducts = [...products, ...goodsGetFrom1C].map((product) => {
      const productId = product._id?.toString();
      const isFavorite = productId ? favoriteSet.has(productId) : false;

      return {
        ...product,
        isLike: isFavorite,
      };
    });

    // Implement pagination on combined products
    const totalProducts = combinedProducts.length + productTotal;
    const paginatedProducts = combinedProducts;

    return {
      products: paginatedProducts, // Current page of products
      total: totalProducts, // Total number of products
      page: Number(page), // Current page
      limit: Number(limit), // Limit per page
    }; // Return the combined products with favorite status
  }

  async getProductsWithCategories() {
    // Шаг 1: Получить все продукты и преобразовать их в обычные объекты (lean)
    const products = await this.productModel.find().lean();

    // Шаг 2: Собрать все уникальные ID категорий из продуктов
    const productItems = products
      .map((product) => product.category)
      .filter((item) => Types.ObjectId.isValid(item));

    // Шаг 3: Получить категории на основе собранных ID
    const categories = await this.categoryService.getCategoriesByIds(
      productItems
    );

    // Шаг 4: Сгруппировать продукты по категориям
    const categoryMap = categories.reduce((acc, category) => {
      if (category._id) {
        acc[category._id.toString()] = {
          name: category.name,
          products: [],
        };
      }
      return acc;
    }, {});

    // Шаг 5: Заполнить категории соответствующими продуктами
    products.forEach((product) => {
      const categoryId = product.category?.toString(); // Безопасная проверка на наличие category
      if (categoryId && categoryMap[categoryId]) {
        // Проверка наличия categoryId
        categoryMap[categoryId].products.push({
          name: product.name,
          price: 50, // Похоже, цена жестко задана, но, возможно, стоит использовать product.price
          buttonText: 'подробнее',
          imageUrl: product.imageBase64, // Убедитесь, что это поле есть в product
        });
      }
    });

    // Шаг 6: Вернуть данные в нужном формате
    return {
      categories: Object.values(categoryMap),
    };
  }

  async getProductsWithFavorites(userId: string) {
    const favorites = await this.favoriteService.getFavorites(userId);

    const favoriteItems = favorites
      .map((favorite) => favorite.product)
      .filter((item) => Types.ObjectId.isValid(item)); // фильтруем некорректные ObjectId

    // Преобразуем отфильтрованные строки в ObjectId
    const objectIdItems = favoriteItems.map((item) => new Types.ObjectId(item));

    // Используем $in для поиска всех продуктов по массиву ObjectId
    const products = await this.productModel
      .find({
        _id: { $in: objectIdItems },
      })
      .lean();
    return products.map((product) => ({ ...product, isLike: true }));
  }

  getParseOptions(description: string): ParsedOptionsType {
    const parsedOptions: ParsedOptionsType = {};
    const strArr = description
      .replaceAll('/t', '')
      .replaceAll('\t', '')
      .replaceAll('', '')
      .split(',');
    strArr.forEach((str) => {
      const splitedParams = str.split('-');
      const param = productRusFieldToEng[splitedParams[0].trim()];
      if (param) parsedOptions[param] = splitedParams[1].trim();
    });
    return parsedOptions;
  }

  async createProduct1C(good: IntegrationProduct, description = '', size = '') {
    console.log('Saving product!!!!!!!!!!!:', good);
    const options = this.getParseOptions(good.description);
    const category = await this.categoryService.getCategoryBy1cId(good.ownerID);
    if (!category) console.error(`No category for product ${good.article}`);
    const product = new this.productModel({
      product1cId: good.goodID,
      name: good.name,
      article: good.article,
      description1c: good.description,
      description,
      size,
      is_active: true,
      color: options.color ? [options.color] : [],
      equipment: options.equipment ? [options.equipment] : [],
      frame: options.frame,
      geometry: options.geometry,
      category: category?._id || null,
      imageBase64: good.imageBase64,
      imagesBase64: good.imagesBase64,
      features: good.features,
      colors: good.colors,
    });
    return product.save();
  }

  async checkIsProductExist(good: IntegrationProduct) {
    const product = await this.productModel
      .findOne({ product1cId: good.goodID })
      .exec();
    return !!product;
  }

  async getProductsByCategoryId(categoryId: string) {
    return this.productModel.find({ category: categoryId }).exec();
  }

  async getProductsNotInCategory(categoryId: string) {
    return this.productModel.find().where('category').ne(categoryId).exec();
  }

  async startIntegration() {
    try {
      // Запускает метод parse, который используется для парсинга данных
      await this.parse('46042');
      // Возможно, добавьте другие операции, связанные с интеграцией
      return { message: 'Integration started successfully' };
    } catch (error) {
      console.error('Error during integration:', error);
      throw new InternalServerErrorException('Integration error');
    }
  }

  async getProductWithQuery(cartIds: string[]) {
    const query: any = {};

    if (cartIds) {
      // Filter out invalid cart IDs and convert valid ones to ObjectId
      const validCartIds = cartIds
        .filter(Types.ObjectId.isValid) // Filter only valid ObjectId strings
        .map((id) => new Types.ObjectId(id)); // Convert to ObjectId instances

      if (validCartIds.length > 0) {
        query._id = { $in: validCartIds };
      } else {
        return []; // Return an empty array if no valid IDs are found
      }
    }
    const products = await this.productModel.find(query).lean().exec();

    return products;
  }
}
