// verification-code.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SmsService } from './sms.service';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [VerificationController],
  exports: [MongooseModule],
  providers: [SmsService, VerificationService],
})
export class VerificationCodeModule {}
