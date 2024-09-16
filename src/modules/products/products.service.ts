
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { CreateParsedProductDto } from './dto/create-parsed-product.dto';
import { Parser } from 'src/helpers/parser';
import { downloadImagesByUrl } from 'src/helpers/utils';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import axios from "axios";
import {
  ErrorIntegrationAnswer,
  IntegrationProduct,
  SuccessIntegrationAnswer
} from "../../types/integration.type";
import { CategoryService } from "../category/category.service";
import { ParsedOptionsType, productRusFieldToEng } from "./helper";

@Injectable()
export class ProductsService {
  private parser: Parser;

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private categoryService: CategoryService,
  ) {
    this.parser = new Parser(this);
    this.parser.init();
  }

  async parse() {
    try {
      const result = await this.parser.parseTrodat2('46042');
      console.log('Parsed data:', result);
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
      console.log(`Product with ID ${data.product_id} already exists. Skipping creation.`);
      return;
    }
    const downloaded_images = await downloadImagesByUrl(data.images);
    data.is_active = false;
    await this.create(data);
  }

  async getProducts() {
    return this.productModel.find().populate('category').exec();
  }

  getParseOptions(description: string): ParsedOptionsType {
    const parsedOptions: ParsedOptionsType = {};
    const strArr = description
      .replaceAll('/t', '')
      .replaceAll('\t', '')
      .replaceAll('', '')
      .split(',');
    strArr.forEach(str => {
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
      category: category?._id || null
    });
    return product.save();
  }

  async checkIsProductExist(good: IntegrationProduct) {
    const product = await this.productModel.findOne({ product1cId: good.goodID }).exec();
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
      await this.parse();
      // Возможно, добавьте другие операции, связанные с интеграцией
      return { message: 'Integration started successfully' };
    } catch (error) {
      console.error('Error during integration:', error);
      throw new InternalServerErrorException('Integration error');
    }
  }
}









