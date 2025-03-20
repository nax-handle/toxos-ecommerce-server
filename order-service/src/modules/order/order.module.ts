import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PaymentStrategyFactory } from '../payment/strategies/strategy-payment';
import { StripePaymentStrategy } from '../payment/strategies/payment/stripe.strategy';
import { CODPaymentStrategy } from '../payment/strategies/payment/cod.strategy';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  controllers: [OrderController],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule,
    PaymentModule,
  ],
  providers: [
    OrderService,
    PaymentStrategyFactory,
    StripePaymentStrategy,
    CODPaymentStrategy,
  ],
})
export class OrderModule {}
