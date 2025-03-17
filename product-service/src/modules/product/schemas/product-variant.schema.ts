import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({ timestamps: true })
export class ProductVariant {
  @Prop({ type: SchemaTypes.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  image: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  sku: string;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
