import { BadGatewayException, Injectable } from '@nestjs/common';
import { WebhookHandler } from './stripe-strategy.interface';
import { CheckoutSessionCompletedHandler } from './checkout.session.completed.strategy';
import { RedisService } from 'src/database/redis/redis.service';
// import { PaymentIntentSucceededHandler } from './stripe/payment.intent.succeeded.strategy';
// import { PaymentIntentFailedHandler } from './stripe/payment.intent.failed.strategy';
@Injectable()
export class WebhookHandlerFactory {
  redisService: RedisService;
  private readonly handlerMap: Record<string, WebhookHandler>;

  constructor(redisService: RedisService) {
    this.redisService = redisService;
    this.handlerMap = {
      'checkout.session.completed': new CheckoutSessionCompletedHandler(
        this.redisService,
      ),
      // 'payment_intent.succeeded': new PaymentIntentSucceededHandler(),
      // 'payment_intent.payment_failed': new PaymentIntentFailedHandler(),
    };
  }

  createHandler(eventType: string): WebhookHandler {
    const createHandlerFn = this.handlerMap[eventType];
    if (!createHandlerFn) {
      throw new BadGatewayException(
        `Handler for event "${eventType}" not found`,
      );
    }
    return createHandlerFn;
  }
}
