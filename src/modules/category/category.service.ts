import { Injectable } from '@nestjs/common';
import {IntegrationGroup} from "../../types/integration.type";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Category} from "./schemas/category.schema";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async getAllCategories() {
    return this.categoryModel.find();
  }

  async createCategory1C(group: IntegrationGroup) {
    const category = new this.categoryModel({
      category1cId: group.ID,
      name: group.name,
      isPublic: true
    });
    return category.save();
  }

  async checkIsCategoryExist(group: IntegrationGroup) {
    const category = await this.categoryModel.findOne({category1cId: group.ID});
    console.log('checkIsCategoryExist', category);
    return !!category;
  }

  async integrateCategory1C(groups: IntegrationGroup[]) {
    for (const group of groups) {
      const isExist = await this.checkIsCategoryExist(group);
      if (!isExist) await this.createCategory1C(group);
    }
  }

  async getCategoryBy1cId(id: string) {
    return this.categoryModel.findOne({category1cId: id});
  }

  async createCategory(name: string) {
    const category = new this.categoryModel({
      category1cId: null,
      isPublic: false,
      name
    });
    await category.save();
    return category;
  }

  async deleteCategory(id: string) {
    const category = await this.categoryModel.deleteOne({_id: id});
    console.log('category', category);
    return {id};
  }
}
