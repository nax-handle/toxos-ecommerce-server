import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get('PRODUCT_SERVICE_URL'),
            package: 'product',
            protoPath: join(__dirname, '../../../proto/product.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
