import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Banner {
  @Prop()
  image: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
