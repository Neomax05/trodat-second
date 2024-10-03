import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productService: ProductsService
  ) {}

  // Create or update the cart for a user
  async createCart(createCartDto: CreateCartItemDto): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId: createCartDto.userId });

    if (cart) {
      cart.items = createCartDto.items; // Update items
      return cart.save(); // Save updated cart
    } else {
      const createdCart = new this.cartModel(createCartDto);
      return createdCart.save(); // Create new cart
    }
  }

  // Add item to the cart
  async addToCart(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<Cart | null> {
    const cart = await this.cartModel.findOneAndUpdate(
      { userId: userId },
      { $push: { items: { productId, quantity } } }, // Use $addToSet to prevent duplicates
      { new: true, upsert: true, lean: true } // Create a new cart if it doesn't exist
    );
    return cart;
  }

  // Remove single item from the cart
  async removeFromCart(
    userId: string,
    productId: string
  ): Promise<Cart | null> {
    const cart = await this.cartModel.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId } } }, // Remove productId from items
      { new: true, lean: true } // Return the updated cart
    );

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  // Remove multiple items from the cart
  async removeMultipleItems(
    userId: string,
    productIds: string[]
  ): Promise<Cart | null> {
    const cart = await this.cartModel.findOne({ userId: userId }).lean();

    console.log(cart, 'cart', userId, productIds);

    if (!cart) {
      throw new NotFoundException('🔴 Cart not found');
    }

    console.log('🟢 carts is sucessfully is removed');

    return cart;
  }

  // Get cart by userId
  async getCart(userId: string): Promise<Cart | null> {
    const cart = await this.cartModel.findOne({ userId: userId }).lean();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart; // Return the found cart
  }

  async getCarts(cartIds?: string[]) {
    const carts = await this.productService.getProductWithQuery(cartIds);
    const newCarts = carts.map((el) => ({
      ...el,
      _id: el._id.toString('hex'),
    }));

    return newCarts;
  }

  async getProductsByIds(ids: string[]) {
    return await this.productService.getProductsByIds(ids);
  }
}
