import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './schemas/news.schema';
import { NewsCreateDto, NewsUpdateDto } from './dto/create-news.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<News>,
    private firebaseService: FirebaseService
  ) {}

  async getAllNews() {
    return this.newsModel.find();
  }

  async getNewsById(id: string) {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async createNews(data: NewsCreateDto, file: Express.Multer.File) {
    const fileUrl = await this.firebaseService.uploadFile(file);
    console.log(data, 'gggg');
    const news = new this.newsModel({
      type: data.type,
      image: fileUrl,
      title: data.title,
      fullDescription: data.fullDescription,
      shortDescription: data.shortDescription,
    });
    await news.save();
    return news;
  }

  async updateNews(
    id: string,
    data: NewsUpdateDto,
    file: Express.Multer.File | undefined
  ) {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    if (file) {
      const url = news.image;
      const fileName = url.substring(url.lastIndexOf('/') + 1);
      console.log(fileName);

      await this.firebaseService.deleteFile(fileName);

      const fileUrl = await this.firebaseService.uploadFile(file);
      data.image = fileUrl;
    }

    Object.assign(news, data);
    await news.save();
    return news;
  }

  async deleteNews(id: string) {
    await this.newsModel.deleteOne({ _id: id });
    return { id };
  }
}
