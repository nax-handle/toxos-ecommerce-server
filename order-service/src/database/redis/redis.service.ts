import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AddToCartDto } from 'src/modules/cart/dto/add-to-cart.dto';
import { RemoveItemDto } from 'src/modules/cart/dto/remove-item.dto';
import { UpdateItemCartDto } from 'src/modules/cart/dto/update-item-cart.dto';

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
  async addToCart(addToCart: AddToCartDto): Promise<void> {
    const { quantity, variantId, shopId, productId, userId } = addToCart;
    const key = `cart:${userId}:${shopId}`;
    const itemKey = `${productId}:${variantId}`;
    const cart = await this.redis.hget(key, itemKey);
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
    const productIds: Set<string> = new Set();
    const allCartItems: Record<string, any[]> = {};
    cartKeys.forEach((cartKey, index) => {
      const shopId = cartKey.split(':')[2];
      const cartItems = results[index][1] as { [key: string]: string };
      allCartItems[shopId] = Object.entries(cartItems).map(([key, value]) => {
        const [productId, variantId] = key.split(':');
        productIds.add(productId);
        return {
          productId,
          variantId,
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

  async removeFromCart(addToCart: AddToCartDto): Promise<void> {
    const { variantId, shopId, productId, userId } = addToCart;
    const key = `cart:${userId}:${shopId}`;
    const itemKey = `${productId}:${variantId}`;
    await this.redis.hdel(key, itemKey);
  }
  async updateItemCart(updateItemCart: UpdateItemCartDto): Promise<void> {
    const { newVariantId, oldVariantId, shopId, productId, userId } =
      updateItemCart;
    const key = `cart:${userId}:${shopId}`;
    const itemKey = `${productId}:${oldVariantId}`;
    const newItemKey = `${productId}:${newVariantId}`;
    const oldItemData = await this.redis.hget(key, itemKey);
    if (!oldItemData) {
      throw new BadRequestException('Item not found in cart');
    }
    await this.redis.hdel(key, itemKey);
    await this.redis.hset(key, newItemKey, oldItemData);
  }
  async removeItemsFromCart(
    removeItemsFromCart: RemoveItemDto[],
  ): Promise<void> {
    if (!removeItemsFromCart.length) return;
    const pipeline = this.redis.pipeline();
    console.log(removeItemsFromCart);
    removeItemsFromCart.forEach((item) =>
      pipeline.hdel(
        `cart:${item.userId}:${item.shopId}`,
        `${item.productId}:${item.variantId}`,
      ),
    );
    await pipeline.exec();
  }
  async storeOrderIds(
    paymentSessionId: string,
    orderIds: string[],
  ): Promise<void> {
    await this.redis.set(
      `payment:${paymentSessionId}:orderIds`,
      JSON.stringify(orderIds),
      'EX',
      60 * 60,
    );
  }
  async getOrderIds(paymentSessionId: string): Promise<string[]> {
    const data = await this.redis.get(`payment:${paymentSessionId}:orderIds`);
    return data ? JSON.parse(data) : [];
  }
  async deleteOrderIds(paymentSessionId: string): Promise<void> {
    await this.redis.del(`payment:${paymentSessionId}:orderIds`);
  }
}
