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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BannerDto } from './dto/banner.dto';
import { BannerService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

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
      storage: memoryStorage(),
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
    const fileUrl = await this.bannerSerive.uploadFile(file);
    return await this.bannerSerive.createBanner({
      image: fileUrl,
    });
  }

  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
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
    const banner = await this.getBannerById(id);
    const url = banner.image;
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    console.log(fileName);

    await this.bannerSerive.deleteFile(fileName);

    const fileUrl = await this.bannerSerive.uploadFile(file);

    return this.bannerSerive.editBanner(id, { ...data, image: fileUrl });
  }

  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    const banner = await this.getBannerById(id);
    const url = banner.image;
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    console.log(fileName);

    await this.bannerSerive.deleteFile(fileName);

    return this.bannerSerive.deleteBanner(id);
  }
}
