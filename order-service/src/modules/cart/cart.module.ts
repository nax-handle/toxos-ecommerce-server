import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { RedisModule } from 'src/databases/redis/redis.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
