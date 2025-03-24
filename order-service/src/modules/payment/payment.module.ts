import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripePaymentStrategy } from './strategies/payment/stripe.strategy';
import { CODPaymentStrategy } from './strategies/payment/cod.strategy';
import { StripeService } from './services/stripe.service';
import { RedisModule } from 'src/database/redis/redis.module';
import { StripeConfig } from 'src/configs/stripe.config';
import { PaymentStrategyFactory } from './strategies/strategies-payment';
import { CheckoutSessionCompletedHandler } from './factories/stripe/checkout.session.completed.strategy';
import { WebhookHandlerFactory } from './factories/stripe/handle-event-stripe.factory';

@Module({
  imports: [RedisModule],
  controllers: [PaymentController],
  providers: [
    StripeConfig,
    PaymentService,
    StripeService,
    PaymentStrategyFactory,
    StripePaymentStrategy,
    CODPaymentStrategy,
    CheckoutSessionCompletedHandler,
    WebhookHandlerFactory,
  ],
  exports: [PaymentService, StripeService],
})
export class PaymentModule {}
