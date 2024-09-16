import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import { CategoryService } from './category.service';
import {CreateCategoryDto} from "./dto/create-category.dto";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Post()
  async createCategory(@Body() data: CreateCategoryDto) {
    return await this.categoryService.createCategory(data.name);
  }

  @Delete(':id')
  async deleteCategory(@Param() param: {id: string}) {
    console.log('param', param);
    return this.categoryService.deleteCategory(param.id);
  }
}
