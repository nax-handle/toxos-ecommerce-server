import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AddToCartDto } from 'src/modules/cart/dtos/add-to-cart.dto';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}
  async setCart(key: string, itemKey: string, quantity: number): Promise<void> {
    const expiration = this.configService.get('CART_EXPIRATION');
    await this.redis.hset(key, itemKey, quantity);
    await this.redis.expire(key, expiration);
  }
  async addToCart(
    userId: string,
    productId: string,
    addToCart: AddToCartDto,
  ): Promise<void> {
    const { quantity, variantId, optionId, shopId } = addToCart;
    const key = `cart:${userId}:${shopId}`;
    const itemKey = `${productId}:${variantId}:${optionId}`;
    const cart = await this.getCart(userId);
    if (cart) {
      await this.increaseQuantity(key, itemKey, quantity);
    } else {
      await this.setCart(key, itemKey, quantity);
    }
  }
  async getCart(userId: string): Promise<{
    productIds: string[];
    allCartItems: Record<string, any[]>;
  }> {
    const cartKeys = await this.redis.keys(`cart:${userId}:*`);
    if (cartKeys.length === 0) {
      return { productIds: [], allCartItems: {} };
    }
    const pipeline = this.redis.pipeline();
    cartKeys.forEach((key) => pipeline.hgetall(key));
    const results = await pipeline.exec();
    if (!results) {
      return { productIds: [], allCartItems: {} };
    }
    console.log(results);
    const productIds: Set<string> = new Set();
    const allCartItems: Record<string, any[]> = {};
    cartKeys.forEach((cartKey, index) => {
      const shopId = cartKey.split(':')[2];
      const cartItems = results[index][1] as { [key: string]: string };
      allCartItems[shopId] = Object.entries(cartItems).map(([key, value]) => {
        const [productId, variantId, optionId] = key.split(':');
        productIds.add(productId);
        return {
          productId,
          variantId,
          optionId,
          quantity: parseInt(value, 10),
        };
      });
    });

    return {
      productIds: Array.from(productIds),
      allCartItems,
    };
  }

  async increaseQuantity(
    key: string,
    itemKey: string,
    quantity: number,
  ): Promise<void> {
    await this.redis.hincrby(key, itemKey, quantity);
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await this.redis.hdel(`cart:${userId}`, productId);
  }
}
