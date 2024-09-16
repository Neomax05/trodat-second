// import { Injectable } from '@nestjs/common';
// import {
//   MongooseModuleOptions,
//   MongooseOptionsFactory,
// } from '@nestjs/mongoose';
// import { ConfigService } from '../config.service';
//
// @Injectable()
// export class MongoConfig implements MongooseOptionsFactory {
//   private readonly host: string;
//   private readonly port: number;
//   private readonly username: string;
//   private readonly password: string;
//   private readonly database: string;
//
//   constructor(configService: ConfigService) {
//     this.host = configService.getString('MYSQL_HOST');
//     this.port = configService.getNumber('MYSQL_PORT');
//     this.username = configService.getString('MYSQL_USER');
//     this.password = configService.getString('MYSQL_PASSWORD');
//     this.database = configService.getString('MYSQL_NAME');
//   }
//
//   createMongooseOptions(): MongooseModuleOptions {
//     return {
//       uri: 'mongodb://localhost/trodat',
//       dbName: this.database,
//     };
//   }
// }



import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { ConfigService } from '../config.service';
import mongoose, { ConnectOptions } from 'mongoose';

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
  private readonly mongoUri: string;
  private readonly logger = new Logger(MongoConfig.name);

  constructor(configService: ConfigService) {
    this.mongoUri = configService.getString('MONGO_URI');
    this.checkConnection();
  }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.mongoUri,
    };
  }

  private async checkConnection(): Promise<void> {
    try {
      // Обновленный код для подключения
      const options: ConnectOptions = {
        autoIndex: true, // Настройка для индексов
      };

      await mongoose.connect(this.mongoUri, options);
      this.logger.log('База данных MongoDB Подключена');
    } catch (error) {
      this.logger.error(' База данных MongoDB НЕ Подключена', error.stack);
      throw new InternalServerErrorException('Failed to connect to MongoDB');
    }
  }
}
