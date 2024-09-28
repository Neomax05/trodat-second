import { BadRequestException, Injectable, Param } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { CreateAdminDto, LoginAdminDto } from './dto';
import { UserRole } from './enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from '../cart/cart.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cartService: CartService
  ) {}

  async create(data) {
    const user = new this.userModel(data);
    return await user.save();
  }

  async findByEmail(email: string) {
    const user = this.userModel
      .findOne({
        where: {
          email: email,
        },
      })
      .lean();

    return user;
  }

  async createAdmin(data: CreateAdminDto) {
    const user = this.findByEmail(data.email);

    if (user) {
      throw new BadRequestException('User with this email already exist');
    }

    data.role = UserRole.ADMIN;

    return await this.create(data);
  }

  async loginAdmin(data: LoginAdminDto) {
    if (data.username !== 'admin') {
      throw new BadRequestException('Username or password wrong');
    }
    if (data.password !== '8R22y87R') {
      throw new BadRequestException('Username or password wrong');
    }

    return {
      isLogin: true,
    };
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<User> {
    const cart = await this.cartService.addToCart(userId, productId);

    return this.userModel.findOneAndUpdate(
      { email: userId },
      { cartId: cart.userId }, // Ensure no duplicates
      { new: true, lean: true }
    );
  }

  async removeFromCart(userId: string, productId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { cart: productId } },
      { new: true, lean: true }
    );
  }

  async getCart(userId: string): Promise<string[]> {
    const user = await this.userModel.findOne({ email: userId }).lean();

    const cart = await this.cartService.getCart(userId);
    console.log(cart, user, 'cart');

    return [];
    // return user.cart;
  }

  async getCarts(userId) {
    return await this.cartService.getCart(userId);
  }
}
