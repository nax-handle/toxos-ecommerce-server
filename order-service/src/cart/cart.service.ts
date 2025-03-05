import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { RedisService } from '../redis/redis.service';

interface ProductService {
  getProduct(data: { id: string }): Observable<any>;
  checkProductStock(data: {
    product_id: string;
    quantity: number;
  }): Observable<any>;
}

@Injectable()
export class CartService implements OnModuleInit {
  private productService: ProductService;

  constructor(
    @Inject('PRODUCT_PACKAGE') private readonly client: ClientGrpc,
    private readonly redisService: RedisService,
  ) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductService>('ProductService');
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    // const stockCheck = await firstValueFrom(
    //   this.productService.checkProductStock({
    //     product_id: productId,
    //     quantity,
    //   }),
    // );

    // if (!stockCheck.available) {
    //   throw new Error('Product is out of stock');
    // }

    // const product = await firstValueFrom(
    //   this.productService.getProduct({ id: productId }),
    // );

    // if (!product) {
    //   throw new Error('Product not found');
    // }

    await this.redisService.addToCart(userId, quantity, productId);

    // return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string) {
    await this.redisService.removeFromCart(userId, productId);
    return this.getCart(userId);
  }

  async getCart(userId: string) {
    const cart = await this.redisService.getCart(userId);

    return { ...cart };
  }

  async clearCart(userId: string) {
    await this.redisService.deleteCart(userId);
    return { items: [], total: 0 };
  }
}
