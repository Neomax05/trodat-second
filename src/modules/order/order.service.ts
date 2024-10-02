import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schema/order.schema';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const productIds = createOrderDto.items.map((item) => item.productId);

    await this.cartService.removeMultipleItems(
      createOrderDto.userId,
      productIds
    );

    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).exec();
  }
}
