import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto, LoginAdminDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 5 * 1024 * 1024;

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

  @UseGuards(AuthGuard('jwt'))
  @Post('cart/add')
  async addToCart(@Req() req: Request, @Body() { productId, quantity }) {
    const userId = req.user['userId'];
    return await this.usersService.addToCart(userId, productId, quantity);
  }

  @Post('cart/remove')
  async removeFromCart() {
    // return this.usersService.removeFromCart(req.user.sub, productId);
  }

  @Get('cart')
  async getCart(@Body() { email }) {
    return this.usersService.getCart(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('carts')
  async getCarts(@Req() req: Request) {
    const userId = req.user['userId'];
    return await this.usersService.getCarts(userId);
  }

  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    })
  )
  @UseGuards(AuthGuard('jwt'))
  @Put('upload')
  async createBanner(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
    )
    file: Express.Multer.File
  ) {
    const userId = req.user['userId'];
    console.log(req.user, 'user req');

    return await this.usersService.updateUserInfo(userId, file);
  }
}
