import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { ProductModule } from '../product/product.module';
import { Observer } from './observer/observer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ProductModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, Observer],
})
export class ReviewModule {}
