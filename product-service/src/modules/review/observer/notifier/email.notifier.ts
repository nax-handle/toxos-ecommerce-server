// email-notifier.ts (Observer 1)
import { EmailService } from 'src/modules/email/email.service';
import { ObserverReviewDto } from '../../dto/response/observer-review.dto';
import { Observer } from '../observer.interface';

export class EmailNotifier implements Observer {
  constructor(private readonly emailService: EmailService) {}
  update(observerReviewDto: ObserverReviewDto) {
    const { comment, shopId } = observerReviewDto;
    console.log(shopId);
    this.emailService
      .sendEmail('123', comment, '[Toxos] Có đánh giá sản phẩm 1 sao')
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  }
}
