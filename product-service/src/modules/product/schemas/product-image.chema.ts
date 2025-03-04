import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductImageDocument = HydratedDocument<ProductImage>;
@Schema({ timestamps: true })
export class ProductImage {
  @Prop()
  image: string;
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product: Types.ObjectId;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);
