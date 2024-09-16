import {Body, Controller, Get, Param, Put} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    return await this.productsService.getProducts();
  }

  @Get('byCategory/:categoryId')
  async getProductsByCategoryId(@Param() param: {categoryId: string}) {
    return await this.productsService.getProductsByCategoryId(param.categoryId);
  }

  @Get('notInCategory/:categoryId')
  async getProductsNotInCategory(@Param() param: {categoryId: string}) {
    return await this.productsService.getProductsNotInCategory(param.categoryId);
  }

  @Put('changeCategory')
  async changeCategory(@Body() body: {categoryId: string, productId: string}) {
    console.log('body', body);
    return this.productsService.changeCategory(body.productId, body.categoryId);
  }


  @Get('integration')
  async integration() {
    return await this.productsService.startIntegration();
  }

  @Get('parse')
  async parse() {
    return await this.productsService.parse();
  }

}
