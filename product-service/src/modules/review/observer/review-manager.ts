import { ObserverReviewDto } from '../dto/response/observer-review.dto';
import { Observer } from './observer.interface';

export class ReviewManager {
  private observers: Observer[] = [];

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  receiveReview(observerReviewDto: ObserverReviewDto) {
    const { rating } = observerReviewDto;
    if (rating === 1) {
      this.notify(observerReviewDto);
    }
  }

  notify(observerReviewDto: ObserverReviewDto) {
    this.observers.forEach((observer) => observer.update(observerReviewDto));
  }
}
