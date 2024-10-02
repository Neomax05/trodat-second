import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { IntegrationProduct } from 'src/@types/integration.type';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from './gruads/jwt.guads';
import { SearchProductsQuery } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getProducts(@Req() req: Request, @Query() query?: SearchProductsQuery) {
    const userId = req.user ? req.user['userId'] : null;
    console.log(userId, 'get product userid', query);

    return await this.productsService.getProducts(userId, query);
  }
  @UseGuards(OptionalJwtAuthGuard)
  @Get('favorites')
  async getProductsWithFavorites(@Req() req: Request) {
    const userId = req.user ? req.user['userId'] : null;
    console.log(userId, 'get product userid');

    return await this.productsService.getProductsWithFavorites(userId);
  }

  @Get('categories')
  async getProductCategories() {
    return await this.productsService.getProductsWithCategories();
  }

  @Get('byCategory/:categoryId')
  async getProductsByCategoryId(@Param() param: { categoryId: string }) {
    return await this.productsService.getProductsByCategoryId(param.categoryId);
  }

  @Get('notInCategory/:categoryId')
  async getProductsNotInCategory(@Param() param: { categoryId: string }) {
    return await this.productsService.getProductsNotInCategory(
      param.categoryId
    );
  }

  @Put('changeCategory')
  async changeCategory(
    @Body() body: { categoryId: string; productId: string }
  ) {
    console.log('body', body);
    return this.productsService.changeCategory(body.productId, body.categoryId);
  }

  @Get('integration')
  async integration() {
    return await this.productsService.startIntegration();
  }

  @Get('parse')
  async parse(@Query('id') id: string) {
    const parsedData = await this.productsService.parse(id);

    this.productsService.createProduct1C(
      parsedData as unknown as IntegrationProduct,
      parsedData.description,
      parsedData.st
    );

    return parsedData;
  }
}
