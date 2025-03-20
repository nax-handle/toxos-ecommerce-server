import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentStrategyFactory } from './strategies/strategy-payment';
import { StripePaymentStrategy } from './strategies/payment/stripe.strategy';
import { CODPaymentStrategy } from './strategies/payment/cod.strategy';
import { StripeService } from './services/stripe.service';
import { RedisModule } from 'src/databases/redis/redis.module';
import { StripeConfig } from 'src/configs/stripe.config';

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
  ],
  exports: [PaymentService, StripeService],
})
export class PaymentModule {}
