import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('favorites')
export class FavoriteItemsController {
  constructor(private readonly favoriteItemsService: FavoriteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':productId/toggle')
  async toggleFavorite(
    @Req() req: Request,
    @Param('productId') productId: string
  ) {
    const userId = req.user['userId']; // ID пользователя из JWT токена

    return this.favoriteItemsService.toggleFavorite(userId, productId);
  }
}
