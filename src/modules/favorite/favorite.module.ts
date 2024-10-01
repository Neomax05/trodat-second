import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteItemsController } from './favorite.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteItem, FavoriteItemSchema } from './schema/favorite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FavoriteItem.name, schema: FavoriteItemSchema },
    ]),
    AuthModule,
  ],
  providers: [FavoriteService],
  controllers: [FavoriteItemsController],
  exports: [FavoriteService],
})
export class FavoriteModule {}
