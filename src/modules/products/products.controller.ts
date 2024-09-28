import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { IntegrationProduct } from 'src/types/integration.type';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    return await this.productsService.getProducts();
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
