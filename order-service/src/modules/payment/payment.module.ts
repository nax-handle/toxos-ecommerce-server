import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentStrategyFactory } from './strategies/strategies-payment';
import { StripePaymentStrategy } from './strategies/payment/stripe.strategy';
import { CODPaymentStrategy } from './strategies/payment/cod.strategy';
import { StripeService } from './services/stripe.service';
import { RedisModule } from 'src/database/redis/redis.module';
import { StripeConfig } from 'src/configs/stripe.config';
import { WebhookHandlerRegistry } from './strategies/strategies-stripe';
import { CheckoutSessionCompletedHandler } from './strategies/stripe/checkout.session.completed.strategy';

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
    WebhookHandlerRegistry,
    CheckoutSessionCompletedHandler,
  ],
  exports: [
    PaymentService,
    StripeService,
    CheckoutSessionCompletedHandler,
    WebhookHandlerRegistry,
  ],
})
export class PaymentModule {}
