import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PaymentStrategyFactory } from '../payment/strategies/strategies-payment';
import { StripePaymentStrategy } from '../payment/strategies/payment/stripe.strategy';
import { CODPaymentStrategy } from '../payment/strategies/payment/cod.strategy';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from '../payment/payment.module';
import { RabbitMQModule } from 'src/modules/rabbitmq/rabbitmq.module';

@Module({
  controllers: [OrderController],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule,
    PaymentModule,
    RabbitMQModule,
  ],
  providers: [
    OrderService,
    PaymentStrategyFactory,
    StripePaymentStrategy,
    CODPaymentStrategy,
  ],
  exports: [OrderService],
})
export class OrderModule {}
