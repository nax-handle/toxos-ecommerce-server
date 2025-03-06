import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;
export type VariantOptionDocument = HydratedDocument<VariantOption>;

@Schema({ timestamps: true })
export class VariantOption {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  sku: string;

  @Prop({ default: 0 })
  price: number;

  // @Prop({ type: Types.ObjectId, ref: 'ProductVariant', required: true })
  // productVariant: Types.ObjectId;

  // @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  // product: Types.ObjectId;
}
export const VariantOptionSchema = SchemaFactory.createForClass(VariantOption);

@Schema({ timestamps: true })
export class ProductVariant {
  @Prop({ type: SchemaTypes.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: false })
  hasOption: boolean;

  // @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  // product: Types.ObjectId;

  @Prop([VariantOptionSchema])
  options: VariantOption[];
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
