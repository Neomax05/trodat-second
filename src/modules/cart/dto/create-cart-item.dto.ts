// src/cart/dto/cart.dto.ts
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { CartItem } from '../schema/cart.schema';

export class CreateCartDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // User ID associated with the cart

  @IsNotEmpty()
  @IsArray()
  items: string[]; // Array of product IDs
}

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // User ID associated with the cart

  @IsNotEmpty()
  @IsString()
  productId: string; // Product ID to be added
  items: CartItem[];
}
