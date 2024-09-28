import { IProduct } from '../interfaces/products.interface';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Features, FeaturesSchema } from './features.schema';

@Schema()
export class Product implements IProduct {
  @Prop({ required: true })
  product1cId: string;

  @Prop({ required: true })
  article: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  description1c: string;

  @Prop({ required: true, default: [], type: [String] })
  color: string[];

  @Prop({ required: true, default: [], type: [String] })
  equipment: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  category: string | null;

  @Prop()
  size: string;

  @Prop()
  frame: string;

  @Prop()
  geometry: string;

  // @ManyToMany(() => FileSchema)
  // @Prop()
  // images: FileSchema[];

  @Prop()
  is_active: boolean;

  @Prop()
  imageBase64: string;

  @Prop()
  imagesBase64: string[];

  @Prop({ type: Array })
  features: {
    title: string;
    images: string[]; // Array of image URLs
    text: string; // Description or text related to the feature
  }[];

  // @ManyToOne(() => CategorySchema, (category) => category.products)
  // @JoinProp({ name: 'category_id' })
  // category: CategorySchema;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
