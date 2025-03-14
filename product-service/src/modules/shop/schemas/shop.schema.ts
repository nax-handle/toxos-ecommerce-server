import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { getSlug } from 'src/utils/slugify';

@Schema({ timestamps: true })
export class Shop {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  logo: string;

  @Prop()
  description: string;

  @Prop({ maxlength: 10 })
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  detailedAddress: string;

  @Prop({ required: true, index: true })
  userId: string;
}
export type ShopDocument = Shop & Document;

export const ShopSchema = SchemaFactory.createForClass(Shop);

ShopSchema.pre<ShopDocument>('save', function (next) {
  if (!this.slug) {
    this.slug = getSlug(this.name);
  }
  next();
});
