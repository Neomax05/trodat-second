import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schema/order.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private userService: UsersService
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const productIds = createOrderDto.items.map((item) => item.productId);

    await this.userService.removeMultipleItems(
      createOrderDto.userId,
      productIds
    );

    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }

  async getOrdersByUserId(userId: string) {
    const orders = await this.orderModel
      .find({ userId }, { items: 1, createdAt: 1, totalAmount: 1 })
      .exec();
    const items = orders.map((order) =>
      order.items.map((item) => item.productId)
    );
    const productIds = items.flat(1);
    const productsData = await this.userService.getProductsByIds(productIds);
    return productsData;
  }

  async getAllOrder() {
    const orders = await this.orderModel.find().lean();

    const userIds = orders.map((order) => order.userId);
    const usersData = await this.userService.getUsers(userIds);

    const allItems = orders.map((order) =>
      order.items.map((item) => item.productId)
    );
    const productIds = allItems.flat(1);

    const productsData = await this.userService.getProductsByIds(productIds);

    console.log(productIds, 'roduc', userIds);

    const newOrder = orders.reduce((prev, curr) => {
      const user = usersData.find(
        (user) => user._id?.toString() === curr.userId
      );

      const products = curr.items.map((item) => {
        const findProduct = productsData.find(
          (product) => product._id.toString() === item.productId
        );

        return findProduct;
      });

      delete curr.items;
      delete curr.userId;

      return [...prev, { ...curr, user, products }];
    }, []);

    return newOrder;
  }
}
