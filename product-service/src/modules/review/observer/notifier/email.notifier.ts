import { Inject, Injectable } from '@nestjs/common';
import { ObserverReviewDto } from '../../dto/response/observer-review.dto';
import { Observer } from '../observer.interface';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailNotifier implements Observer {
  constructor(
    @Inject('RMQ_NOTIFICATION') private readonly client: ClientProxy,
  ) {}
  update(observerReviewDto: ObserverReviewDto) {
    const { comment, shopId, productId } = observerReviewDto;
    this.client
      .emit('send_email_to_shop', {
        shopId,
        subject: '[Toxos] Có đánh giá sản phẩm 1 sao',
        content: `Có đánh giá sản phẩm 1 sao: ${comment}`,
        productId,
      })
      .subscribe({ error: (err) => console.log(err) });
  }
}
