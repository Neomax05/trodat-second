import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto, LoginAdminDto } from './dto';
import { User } from './users.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Role(UserRole.SUPERADMIN)
  @Post('create/admin')
  async createAdmin(@Body() data: CreateAdminDto) {
    return await this.usersService.createAdmin(data);
  }

  @Post('login/admin')
  async loginAdmin(@Body() data: LoginAdminDto) {
    return await this.usersService.loginAdmin(data);
  }

  // @UseGuards(JwtGuard)
  @Post('cart/add')
  async addToCart(@Body() { productId, email, quantity }) {
    console.log(email, productId, quantity);

    return this.usersService.addToCart(email, productId, quantity);
  }

  @Post('cart/remove')
  async removeFromCart(@Body() { productId }, @User() user: CreateAdminDto) {
    // return this.usersService.removeFromCart(req.user.sub, productId);
  }

  @Get('cart')
  async getCart(@Body() { email }) {
    return this.usersService.getCart(email);
  }

  @Get('cart/:id')
  async getCarts(@Param('id') id: string) {
    return await this.usersService.getCarts(id);
  }
}
