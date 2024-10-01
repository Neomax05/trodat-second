// favorite-items.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FavoriteItem } from './schema/favorite.schema';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(FavoriteItem.name)
    private favoriteItemModel: Model<FavoriteItem>
  ) {}

  async toggleFavorite(
    userId: string,
    productId: string
  ): Promise<{ message: string; statusCode: number }> {
    const existingFavorite = await this.favoriteItemModel.findOne({
      user: userId,
      product: productId,
    });

    if (existingFavorite) {
      // Если товар уже в избранном, удаляем его
      await this.favoriteItemModel.deleteOne({
        user: userId,
        product: productId,
      });
      return { message: 'Item removed from favorites', statusCode: 200 };
    } else {
      // Если товара нет в избранном, добавляем его
      const favoriteItem = new this.favoriteItemModel({
        user: userId,
        product: productId,
      });
      await favoriteItem.save();
      return { message: 'Item added to favorites', statusCode: 200 };
    }
  }

  async getFavorites(userId: string): Promise<FavoriteItem[]> {
    if (!userId) return [];

    return this.favoriteItemModel.find({ user: userId }).lean().exec();
  }
}
