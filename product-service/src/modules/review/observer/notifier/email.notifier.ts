// email-notifier.ts (Observer 1)
import { ObserverReviewDto } from '../../dto/response/observer-review.dto';
import { Observer } from '../observer.interface';

export class EmailNotifier implements Observer {
  update(observerReviewDto: ObserverReviewDto) {
    const { productId, comment } = observerReviewDto;
    console.log(
      `📧 Email Alert: Product ${productId} got a 1-star review. Comment: "${comment}".`,
    );
  }
}
