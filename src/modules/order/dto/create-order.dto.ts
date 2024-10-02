import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  userId: string;

  @IsArray()
  items: { productId: string; quantity: number }[];

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
}
