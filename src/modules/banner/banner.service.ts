import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BannerDto } from './dto/banner.dto';
import { Banner } from './schema/banner.schema';
import { ObjectId } from 'mongodb';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private readonly bannerModel: Model<Banner>,
    private firebaseService: FirebaseService
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return this.firebaseService.uploadFile(file);
  }

  async deleteFile(fileName: string): Promise<void> {
    return this.firebaseService.deleteFile(fileName);
  }

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
  }

  async deleteBanner(id: string | ObjectId) {
    await this.bannerModel.findById(id);

    await this.bannerModel.findByIdAndDelete(id, {
      lean: true,
    });

    // this.bannerModel.deleteOne({ _id: id });

    return { message: 'banner is successfully deleted!' };
  }
}
