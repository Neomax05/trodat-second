import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class VerificationCode extends Document {
  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  code: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ expires: '5m' }) // Code will expire after 5 minutes
  createdAt: Date;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);
