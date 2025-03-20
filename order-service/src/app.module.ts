import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MySQLModule } from './database/mysql.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'GRPC_PRODUCT_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: ['product'],
          protoPath: ['src/proto/product.proto'],
        },
      },
      {
        name: 'GRPC_AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: ['shop'],
          protoPath: ['src/proto/shop.proto'],
        },
      },
    ]),
    MySQLModule,
    CartModule,
    OrderModule,
    VoucherModule,
    PaymentModule,
    RabbitMQModule,
  ],
  providers: [],
  exports: [ClientsModule],
})
export class AppModule {}
