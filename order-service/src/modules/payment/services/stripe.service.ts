import { BadGatewayException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/database/redis/redis.service';
import Stripe from 'stripe';
import { StripeConfig } from 'src/configs/stripe.config';
import { WebhookHandlerRegistry } from '../strategies/strategies-stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly redisService: RedisService,
    private stripeConfig: StripeConfig,
    private webhookHandlerRegistry: WebhookHandlerRegistry,
  ) {
    this.stripe = new Stripe(
      stripeConfig.getConfig().stripeSecretKey as string,
      {
        apiVersion: '2025-02-24.acacia',
      },
    );
  }

  async createVNDPaymentSession(
    totalAmount: number,
    orderIds: string[],
  ): Promise<string> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'vnd',
              unit_amount: totalAmount,
              product_data: {
                name: 'Thanh toán hóa đơn Toxos',
                description: 'Toxos là sàn thương mại điện tử.',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.stripeConfig.getConfig().stripeSuccessUrl as string}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.stripeConfig.getConfig().stripeCancelUrl}/cancel`,
      });

      await this.redisService.storeOrderIds(session.id, orderIds);
      return session.url as string;
    } catch (error) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }
  async handleWebhook(body: Buffer, signature: string): Promise<string[]> {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.stripeConfig.getConfig().stripeEndpointKey as string,
      );
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
    const handler = this.webhookHandlerRegistry.getHandler(event.type);
    return handler?.handle(event);
  }
}
