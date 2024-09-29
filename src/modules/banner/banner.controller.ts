import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BannerDto } from './dto/banner.dto';
import { BannerService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 5 * 1024 * 1024;

@Controller('banner')
export class BannerController {
  constructor(private bannerSerive: BannerService) {}
  @Get()
  async getBanners() {
    return this.bannerSerive.getBanners();
  }

  @Get(':id')
  async getBannerById(@Param('id') id: string) {
    return this.bannerSerive.getBannerById(id);
  }

  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
    })
  )
  @Post()
  async createBanner(
    @Body() data: BannerDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
    )
    file: Express.Multer.File
  ) {
    console.log('data', data);
    console.log('file', file);
    return await this.bannerSerive.createBanner({
      image: file.filename,
    });
  }

  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
    })
  )
  @Put(':id')
  async editBanner(
    @Body() data: BannerDto,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
    )
    file: Express.Multer.File
  ) {
    console.log(id, data, file, 'put');

    return this.bannerSerive.editBanner(id, { ...data, image: file.filename });
  }

  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    return this.bannerSerive.deleteBanner(id);
  }
}
