// features.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeaturesDocument = Features & Document;

@Schema()
export class Features {
  @Prop()
  material: string; // e.g., "Нержавеющая сталь"

  @Prop()
  size: string; // e.g., "Ø 45 мм"

  @Prop()
  series: string; // e.g., "Professional 4.0"

  @Prop()
  packaging: string; // e.g., "Картонная"

  @Prop([String])
  images: string[]; // e.g., ["img1.png", "img2.png"]
}

export const FeaturesSchema = SchemaFactory.createForClass(Features);
