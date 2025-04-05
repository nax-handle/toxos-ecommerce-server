import { Injectable } from '@nestjs/common';
import { ObserverReviewDto } from '../dto/response/observer-review.dto';
import { EmailNotifier } from './notifier/email.notifier';
import { ReviewManager } from './review-manager';

@Injectable()
export class Observer {
  constructor(private readonly emailNotifier: EmailNotifier) {}
  observerReview(observerReviewDto: ObserverReviewDto) {
    const reviewManager = new ReviewManager();
    reviewManager.addObserver(this.emailNotifier);
    reviewManager.receiveReview(observerReviewDto);
  }
}
