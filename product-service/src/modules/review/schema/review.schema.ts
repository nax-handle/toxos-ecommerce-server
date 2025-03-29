import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ type: [String], required: false })
  images: string[];

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 'anonymous' })
  userName: string;

  @Prop({ default: '' })
  userAvatar: string;

  @Prop({ default: '' })
  variation: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'product' })
  product: Types.ObjectId;

  @Prop({ required: true })
  orderId: string;
  @Prop({ required: true })
  shopId: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
