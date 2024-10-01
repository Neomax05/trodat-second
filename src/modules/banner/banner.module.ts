import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerSchema } from './schema/banner.schema';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Banner', schema: BannerSchema }]),
    FirebaseModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
