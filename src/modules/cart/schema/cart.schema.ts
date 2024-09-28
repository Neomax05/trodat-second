// src/cart/schemas/cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema'; // Adjust the path as needed

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: String, required: true, ref: User.name })
  userId: string; // Reference to the user

  @Prop({ required: true })
  items: CartItem[]; // Array of items in the cart
}

export interface CartItem {
  productId: string; // Reference to the product
  quantity: number; // Quantity of the product
}

export const CartSchema = SchemaFactory.createForClass(Cart);
