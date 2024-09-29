import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BannerDto } from './dto/banner.dto';
import { Banner } from './schema/banner.schema';
import { ObjectId } from 'mongodb';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private readonly bannerModel: Model<Banner>
  ) {}

  async getBanners() {
    return this.bannerModel.find().exec();
  }

  async getBannerById(id: string) {
    return this.bannerModel.findById(id).lean();
  }

  async createBanner(data: BannerDto) {
    const banner = this.bannerModel.create(data);

    return banner;
  }

  async editBanner(id: string | ObjectId, data: BannerDto) {
    await this.bannerModel.findOneAndUpdate({ _id: id }, data, { lean: true });

    if (data.image) {
      const filePath = join(__dirname, '..', '..', '..', 'uploads', data.image);
      await unlink(filePath);
    }
  }

  async deleteBanner(id: string | ObjectId) {
    const banner = await this.bannerModel.findById(id);

    if (banner.image) {
      const filePath = join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        banner.image
      );
      try {
        await unlink(filePath);
      } catch (error) {
        console.log('🔴 file not removed');
      }
    }

    await this.bannerModel.findByIdAndDelete(id, {
      lean: true,
    });

    // this.bannerModel.deleteOne({ _id: id });

    return { message: 'banner is successfully deleted!' };
  }
}
