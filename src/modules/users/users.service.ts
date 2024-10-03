import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { CreateAdminDto, LoginAdminDto } from './dto';
import { UserRole } from './enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cartService: CartService,
    private firebaseService: FirebaseService
  ) {}

  async create(data) {
    const user = new this.userModel(data);
    return await user.save();
  }

  async uploadProfileImage(file: Express.Multer.File) {
    return await this.firebaseService.uploadFile(file);
  }

  async deleteFile(fileName: string): Promise<void> {
    return await this.firebaseService.deleteFile(fileName);
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
    const cart = await this.cartService.addToCart(userId, productId, quantity);

    return await this.userModel.findOneAndUpdate(
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

  async getCarts(id: string) {
    const cart = await this.cartService.getCart(id);

    const cartIds = cart.items.map((el) => el.productId);

    return await this.cartService.getCarts(cartIds);
  }

  async getUsers(userIds: string[]) {
    return await this.userModel
      .find(
        { _id: { $in: userIds } },
        { avatar: 1, email: 1, full_name: 1, phone_number: 1 }
      )
      .lean();
  }

  async getAllUsers() {
    const users = await this.userModel
      .find(
        {},
        {
          avatar: 1,
          created_at: 1,
          email: 1,
          full_name: 1,
          phone_number: 1,
          role: 1,
          updated_at: 1,
        }
      )
      .lean();

    return users.map((user) => ({ ...user, _id: user._id?.toString() }));
  }

  async removeMultipleItems(userId: string, productIds: string[]) {
    return await this.cartService.removeMultipleItems(userId, productIds);
  }

  async getProductsByIds(ids: string[]) {
    return await this.cartService.getProductsByIds(ids);
  }

  async updateUserInfo(userId: string, file: Express.Multer.File) {
    const user = await this.userModel.findById(userId).lean();

    const fileUrl = await this.uploadProfileImage(file);

    if (!user) throw new UnauthorizedException('user not found');

    console.log(fileUrl);

    await this.userModel.findByIdAndUpdate(userId, { avatar: fileUrl });

    if (!user.avatar) {
      return {
        avatar: fileUrl,
        full_name: user.full_name,
        phone_number: user.phone_number,
        email: user.email,
      };
    }

    const url = user.avatar;
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    console.log(fileName);

    await this.firebaseService.deleteFile(fileName);

    return {
      avatar: fileUrl,
      full_name: user.full_name,
      phone_number: user.phone_number,
      email: user.email,
    };
  }
}
