import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RedisService } from 'src/databases/redis/redis.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';

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
  async addToCart(userId: string, addToCart: AddToCartDto): Promise<any> {
    await this.redisService.addToCart(userId, addToCart);
    return this.getCart(userId);
  }
  async getShopDummy() {
    return {
      items: [
        {
          _id: '123',
          name: 'Shop 1',
        },
        {
          _id: '1234',
          name: 'Shop 2',
        },
      ],
    };
  }
  async getCart(userId: string): Promise<any> {
    const cartItems = await this.redisService.getCart(userId);
    if (!cartItems) return [];

    const { productIds, allCartItems } = cartItems;
    const shopIds = Object.keys(allCartItems);

    const [productsResponse, shopsResponse] = await Promise.all([
      productIds.length
        ? this.productService.FindMany({ ids: productIds }).toPromise()
        : { items: [] },
      this.getShopDummy(),
      // shopIds.length
      //   ? this.shopService.FindMany({ ids: shopIds }).toPromise()
      //   : { items: [] },
    ]);
    console.log(productsResponse);
    const productMap = new Map(
      productsResponse.items.map((product) => [product._id, product]),
    );

    const shopMap = new Map(
      shopsResponse.items.map((shop) => [shop._id, { ...shop, products: [] }]),
    );

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
          optionId: cartItem.optionId,
        };
      }),
    }));

    console.log(shopList);
    return shopList;
  }

  async removeFromCart(removeFromCart: AddToCartDto): Promise<void> {
    await this.redisService.removeFromCart(removeFromCart);
  }
  async updateItemCart(removeFromCart: AddToCartDto): Promise<void> {
    await this.redisService.updateItemCart(removeFromCart);
  }
}
