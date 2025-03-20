import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { WebhookHandler } from '../interface/stripe-strategy.interface';
import { RedisService } from 'src/database/redis/redis.service';
@Injectable()
export class CheckoutSessionCompletedHandler implements WebhookHandler {
  constructor(private redisService: RedisService) {}
  async handle(event: Stripe.Event): Promise<string[]> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const ids = await this.redisService.getOrderIds(paymentIntent.id);
    await this.redisService.deleteOrderIds(paymentIntent.id);
    return ids;
  }
}
