import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { RedisModule } from 'src/databases/redis/redis.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    ClientsModule.register([
      {
        name: 'GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: ['product', 'shop'],
          protoPath: ['src/proto/product.proto', 'src/proto/shop.proto'],
        },
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
