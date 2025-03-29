import { Review } from '../../schema/review.schema';

export interface ProductReviewsResponse {
  reviews: Review[];
  page: number;
  limit: number;
  totalPages: number;
}
