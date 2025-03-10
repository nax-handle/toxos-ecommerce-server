import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { RedisModule } from 'src/databases/redis/redis.module';
@Module({
  imports: [
    ConfigModule,
    RedisModule,
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: 'product',
          protoPath: 'src/protos/product.proto',
        },
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
