import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RedisService } from 'src/databases/redis/redis.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';

interface ProductService {
  FindOne(data: { id: string }): Observable<any>;
  FindMany(data: { ids: string[] }): Observable<any>;
}
interface ShopService {
  FindMany(data: { ids: string[] }): Observable<any>;
}
@Injectable()
export class CartService implements OnModuleInit {
  private productService: ProductService;
  private shopService: ShopService;

  constructor(
    @Inject('GRPC_SERVICE') private client: ClientGrpc,
    private readonly redisService: RedisService,
  ) {}
  onModuleInit() {
    this.productService =
      this.client.getService<ProductService>('ProductService');
    this.shopService = this.client.getService<ShopService>('ShopService');
  }
  async addToCart(addToCart: AddToCartDto): Promise<any> {
    await this.redisService.addToCart(addToCart);
  }
  async getCart(userId: string): Promise<any> {
    const cartItems = await this.redisService.getCart(userId);
    if (!cartItems) return [];
    const { productIds, allCartItems } = cartItems;
    console.log(allCartItems);
    const shopIds = Object.keys(allCartItems);
    console.log(productIds);
    console.log(shopIds);
    const [productsResponse, shopsResponse] = await Promise.all([
      productIds.length
        ? this.productService.FindMany({ ids: productIds }).toPromise()
        : { items: [] },
      shopIds.length
        ? this.shopService.FindMany({ ids: shopIds }).toPromise()
        : { items: [] },
    ]);
    const [productMap, shopMap] = await Promise.all([
      new Map(productsResponse.items.map((product) => [product._id, product])),
      new Map(
        shopsResponse.shops.map((shop) => [
          shop._id,
          { ...shop, products: [] },
        ]),
      ),
    ]);
    const shopList = shopIds.map((shopId) => ({
      ...(shopMap.get(shopId) || {}),
      products: allCartItems[shopId].map((cartItem) => {
        const product = productMap.get(cartItem.productId);
        if (!product) return null;
        return {
          ...product,
          shopId,
          quantity: cartItem.quantity,
          variantId: cartItem.variantId,
        };
      }),
    }));
    return shopList;
  }

  async removeFromCart(removeFromCart: AddToCartDto): Promise<void> {
    await this.redisService.removeFromCart(removeFromCart);
  }
  async updateItemCart(removeFromCart: AddToCartDto): Promise<void> {
    await this.redisService.updateItemCart(removeFromCart);
  }
}
