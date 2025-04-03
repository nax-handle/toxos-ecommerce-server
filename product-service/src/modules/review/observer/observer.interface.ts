import { ObserverReviewDto } from '../dto/response/observer-review.dto';

export interface Observer {
  update(observerReviewDto: ObserverReviewDto): void;
}
