import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewProductDto } from './dto/review-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'src/utils/object-id';
import {
  StatsReviewsResponse,
  RatingStat,
  ReviewDistribution,
} from './dto/response/state-response.dto';
import { ProductReviewsResponse } from './dto/response/review-response.dto';
import { ProductService } from '../product/services/product.service';
import { Observer } from './observer/observer';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    private readonly productService: ProductService,
    private readonly observer: Observer,
  ) {}
  async reviewProduct(
    reviewProduct: ReviewProductDto[],
    userId: string,
  ): Promise<void> {
    const { shopId } = reviewProduct[0];
    await this.productService.getProductOfShop(shopId);
    const result = true;
    if (!result)
      throw new BadRequestException(
        'Không thể đánh giá sản phẩm vui lòng thử lại',
      );
    const reviews = reviewProduct.map((item: ReviewProductDto) => ({
      ...item,
      product: ObjectId(item.product),
      likes: 0,
      userId,
    }));
    await this.reviewModel.insertMany(reviews);
    // this.observer.observerReview();
  }
  async deleteReview(id: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findOne({
      _id: ObjectId(id),
      userId: userId,
    });
    if (!review) throw new BadRequestException('Không tìm thấy đánh giá');
    await review.deleteOne();
  }
  async getProductReviewsWithStats(
    productId: string,
  ): Promise<StatsReviewsResponse> {
    const statsAggregation: RatingStat[] = await this.reviewModel.aggregate([
      { $match: { product: ObjectId(productId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
          total: { $sum: '$rating' },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const totalReviews: number = statsAggregation.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    const avgRating: number =
      totalReviews > 0
        ? statsAggregation.reduce(
            (sum, item) => sum + item._id * item.count,
            0,
          ) / totalReviews
        : 0;
    const distribution: ReviewDistribution[] = statsAggregation.map((item) => ({
      stars: item._id,
      count: item.count,
      percentage:
        totalReviews > 0
          ? parseFloat(((item.count / totalReviews) * 100).toFixed(1))
          : 0,
    }));

    return {
      average: parseFloat(avgRating.toFixed(1)),
      total: totalReviews,
      distribution,
    };
  }
  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ProductReviewsResponse> {
    const skip = (page - 1) * limit;
    const [reviews, totalReviews] = await Promise.all([
      await this.reviewModel
        .find({ product: ObjectId(productId) })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean<Review[]>()
        .exec(),
      await this.reviewModel.countDocuments({
        product: ObjectId(productId),
      }),
    ]);
    return {
      reviews,
      page,
      limit,
      totalPages: Math.ceil(totalReviews / limit),
    };
  }
}
