import { ObserverReviewDto } from '../dto/response/observer-review.dto';
import { EmailNotifier } from './notifier/email.notifier';
import { ReviewManager } from './review-manager';

export class Observer {
  constructor(
    private readonly reviewManager: ReviewManager,
    private readonly emailNotifier: EmailNotifier,
  ) {}
  observerReview(observerReviewDto: ObserverReviewDto) {
    this.reviewManager.addObserver(this.emailNotifier);
    this.reviewManager.receiveReview(observerReviewDto);
  }
}
