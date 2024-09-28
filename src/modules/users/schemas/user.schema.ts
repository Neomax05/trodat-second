import { IUser } from '../interfaces/users.interface';
import { UserRole } from '../enums';
import { Exclude } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User implements IUser {
  @Prop({ unique: [true, 'Dublicate email entered!'] })
  email: string;

  @Exclude()
  @Prop()
  password: string;

  @Prop()
  full_name: string;

  @Prop()
  phone_number: string;

  @Prop()
  role: UserRole;

  @Exclude()
  @Prop()
  created_at: Date;

  @Exclude()
  @Prop()
  updated_at: Date;

  @Prop()
  avatar: string;

  @Prop()
  verificationCode: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  code: string;

  @Prop()
  cartId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
