import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schema/order.schema';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto
  ): Promise<Order> {
    const userId = req.user['userId'];
    return this.orderService.createOrder({ ...createOrderDto, userId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getOrders(@Req() req: Request): Promise<Order[]> {
    const userId = req.user['userId'];
    return this.orderService.getOrdersByUserId(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllOrders(@Req() req: Request) {
    const userEmail = req.user['email'];
    if (userEmail !== 'admin@trodat.kg') {
      throw new ForbiddenException('Access danied');
    }

    return await this.orderService.getAllOrder();
  }
}
