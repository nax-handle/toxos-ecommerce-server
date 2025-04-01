import { Controller, Post, Body, Param, Query, Get } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewProductDto } from './dto/review-product.dto';
import { StatsReviewsResponse } from './dto/response/state-response.dto';
import { ProductReviewsResponse } from './dto/response/review-response.dto';
import { UserId } from 'src/common/decorator/user.decorator';
import { MessageResponse } from 'src/common/decorator/message-response.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('product')
  @MessageResponse('Đánh giá thành công')
  reviewProduct(
    @Body() reviewProduct: ReviewProductDto[],
    @UserId() userId: string,
  ) {
    return this.reviewService.reviewProduct(reviewProduct, userId);
  }
  @Get('stats/:id')
  getStats(@Param() params: { id: string }): Promise<StatsReviewsResponse> {
    {
      return this.reviewService.getProductReviewsWithStats(params.id);
    }
  }
  @Get('product/:id')
  getProductReviews(
    @Param() params: { id: string },
    @Query() queries: { page: number },
  ): Promise<ProductReviewsResponse> {
    {
      return this.reviewService.getProductReviews(params.id, queries.page);
    }
  }
}
