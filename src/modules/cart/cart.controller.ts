import { Body, Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async removeCart(@Req() req: Request, @Body('productId') productId: string) {
    const userId = req.user['userId'];

    return await this.cartService.removeFromCart(userId, productId);
  }
}
