import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  async getCart(userId: string): Promise<any> {
    const cart = await this.redis.hgetall(`cart:${userId}`);
    return cart;
  }

  async setCart(
    userId: string,
    quantity: number,
    productId: string,
  ): Promise<void> {
    const expiration = this.configService.get('CART_EXPIRATION');

    // const keyType = await this.redis.type(`cart:${userId}`);
    // if (keyType !== 'hash' && keyType !== 'none') {
    //   await this.redis.del(`cart:${userId}`);
    // }
    await this.redis.hset(`cart:${userId}`, productId, quantity.toString());
    await this.redis.expire(`cart:${userId}`, expiration);
  }

  async deleteCart(userId: string): Promise<void> {
    await this.redis.del(`cart:${userId}`);
  }

  async addToCart(
    userId: string,
    quantity: number,
    productId: string,
  ): Promise<void> {
    const cart = await this.redis.hget(`cart:${userId}`, productId);
    if (cart) {
      await this.updateQuantity(userId, productId, quantity);
    } else {
      await this.setCart(userId, quantity, productId);
    }
  }
  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<void> {
    await this.redis.hset(`cart:${userId}`, productId, quantity.toString());
  }
  async removeFromCart(userId: string, productId: string): Promise<void> {
    await this.redis.hdel(`cart:${userId}`, productId);
  }
}
