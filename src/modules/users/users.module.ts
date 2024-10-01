import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule,
    AuthModule,
    CartModule,
    FavoriteModule,
    FirebaseModule,
  ],

  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
