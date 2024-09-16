import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {Product, ProductSchema} from './schemas/product.schema';
import {MongooseModule} from "@nestjs/mongoose";
import {CategoryModule} from "../category/category.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}]),
    CategoryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
