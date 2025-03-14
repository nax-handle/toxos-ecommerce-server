import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PRODUCT_STATUS } from 'src/common/constants/product-status';
import { ProductVariant, ProductVariantSchema } from './product-variant.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  // @Transform(({ value }: { value: Product }) => getSlug(value.title))
  slug: string;

  @Prop({ enum: PRODUCT_STATUS, default: PRODUCT_STATUS.ACTIVE })
  status: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProductImage' }] })
  images: string;

  @Prop({ default: 0 })
  soldCount: number;

  @Prop()
  brand: string;

  @Prop()
  origin: string;

  @Prop({ default: false })
  hasVariant: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shop: Types.ObjectId;

  @Prop({ type: Types.ObjectId, index: true, ref: 'Category' })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, index: true, ref: 'Subcategory' })
  subcategory: Types.ObjectId;

  @Prop({ type: Array, default: [] })
  attributes: [{ name: string; value: string }];

  @Prop([ProductVariantSchema])
  variants: ProductVariant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
