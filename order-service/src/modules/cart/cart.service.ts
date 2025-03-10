import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { RedisService } from 'src/databases/redis/redis.service';
import { Cart, CartItem, Voucher } from './interfaces/cart.interface';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductService {
  FindOne(data: { id: string }): Observable<any>;
  FindMany(data: { ids: string[] }): Observable<any>;
}

@Injectable()
export class CartService implements OnModuleInit {
  private productService: ProductService;
  constructor(
    @Inject('PRODUCT_SERVICE') private client: ClientGrpc,
    private readonly redisService: RedisService,
  ) {}
  onModuleInit() {
    this.productService =
      this.client.getService<ProductService>('ProductService');
  }
  async addToCart(userId: string, productId: string, quantity: number) {
    await this.redisService.addToCart(userId, quantity, productId);
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string) {
    await this.redisService.removeFromCart(userId, productId);
    return this.getCart(userId);
  }

  async updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ) {
    return this.getCart(userId);
  }

  async getCart(userId: string): Promise<any> {
    const cartItems = await this.redisService.getCart(userId);
    const productsResponse = await this.productService
      .FindMany({ ids: Object.keys(cartItems) })
      .toPromise();
    console.log(cartItems);
    const cartWithQuantity = productsResponse.items.map((product) => ({
      ...product,
      quantity: JSON.parse(cartItems[product._id]),
      total: product.price * JSON.parse(cartItems[product._id]),
    }));
    return cartWithQuantity;
  }

  async clearCart(userId: string) {
    await this.redisService.deleteCart(userId);
    return { items: [], total: 0 };
  }
}
