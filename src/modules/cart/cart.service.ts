// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  // Create or update the cart for a user
  async createCart(createCartDto: CreateCartItemDto): Promise<Cart> {
    // Check if the cart already exists for the user
    const cart = await this.cartModel.findOne({ userId: createCartDto.userId });

    // If cart exists, update it; if not, create a new cart
    if (cart) {
      cart.items = createCartDto.items; // Update items
      return cart.save(); // Save updated cart
    } else {
      const createdCart = new this.cartModel(createCartDto);
      return createdCart.save(); // Create new cart
    }
  }

  // Add item to the cart
  async addToCart(userId: string, productId: string): Promise<Cart | null> {
    const cart = await this.cartModel.findOneAndUpdate(
      { userId: userId },
      { $addToSet: { items: productId } }, // Use $addToSet to prevent duplicates
      { new: true, upsert: true, lean: true } // Create a new cart if it doesn't exist
    );
    return cart;
  }

  // Remove item from the cart
  async removeFromCart(
    userId: string,
    productId: string
  ): Promise<Cart | null> {
    const cart = await this.cartModel.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: productId } }, // Remove productId from items
      { new: true, lean: true } // Return the updated cart
    );

    if (!cart) {
      throw new NotFoundException('Cart not found'); // Handle case where cart is not found
    }

    return cart;
  }

  // Get cart by userId
  async getCart(userId: string): Promise<Cart | null> {
    const cart = await this.cartModel.findOne({ userId: userId }).lean();

    if (!cart) {
      throw new NotFoundException('Cart not found'); // Handle case where cart is not found
    }

    return cart; // Return the found cart
  }
}
