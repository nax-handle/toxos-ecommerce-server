import { BadGatewayException, Injectable } from '@nestjs/common';
import { WebhookHandler } from './interface/stripe-strategy.interface';
import { CheckoutSessionCompletedHandler } from './stripe/checkout.session.completed.strategy';

@Injectable()
export class WebhookHandlerRegistry {
  private readonly handlers: Record<string, WebhookHandler>;

  constructor(
    // private readonly paymentIntentSucceededHandler: PaymentIntentSucceededHandler,
    // private readonly paymentIntentFailedHandler: PaymentIntentFailedHandler,
    private readonly checkoutSessionCompletedHandler: CheckoutSessionCompletedHandler,
  ) {
    this.handlers = {
      //   'payment_intent.succeeded': this.paymentIntentSucceededHandler,
      //   'payment_intent.payment_failed': this.paymentIntentFailedHandler,
      'checkout.session.completed': this.checkoutSessionCompletedHandler,
    };
  }

  getHandler(eventType: string): WebhookHandler {
    const handler = this.handlers[eventType];
    if (!handler)
      throw new BadGatewayException('Handler stripe event not found');
    return handler;
  }
}
