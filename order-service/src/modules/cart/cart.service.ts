import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RedisService } from 'src/database/redis/redis.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateItemCartDto } from './dto/update-item-cart.dto';
import { OrderItem } from '../order/entities/order-item.entity';
import { RemoveItemDto } from './dto/remove-item.dto';
import { ProductService } from 'src/interfaces/grpc/product-service.interface';

interface ShopService {
  FindMany(data: { ids: string[] }): Observable<any>;
}
@Injectable()
export class CartService implements OnModuleInit {
  private productService: ProductService;
  private shopService: ShopService;

  constructor(
    @Inject('GRPC_PRODUCT_SERVICE') private clientProduct: ClientGrpc,
    @Inject('GRPC_AUTH_SERVICE') private clientAuth: ClientGrpc,

    private readonly redisService: RedisService,
  ) {}
  onModuleInit() {
    this.productService =
      this.clientProduct.getService<ProductService>('ProductService');
    this.shopService = this.clientAuth.getService<ShopService>('ShopService');
  }
  async addToCart(addToCart: AddToCartDto): Promise<any> {
    return await this.redisService.addToCart(addToCart);
  }
  async getCart(userId: string): Promise<any> {
    const cartItems = await this.redisService.getCart(userId);
    if (!cartItems.allCartItems || cartItems.productIds?.length === 0)
      return [];
    const { productIds, allCartItems } = cartItems;
    const shopIds = Object.keys(allCartItems);
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
        shopsResponse.shops.map((shop) => [shop.id, { ...shop, products: [] }]),
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
  async updateItemCart(updateItemCart: UpdateItemCartDto): Promise<void> {
    await this.redisService.updateItemCart(updateItemCart);
  }
  async removeItemsFromCart(removeItems: RemoveItemDto[]): Promise<void> {
    await this.redisService.removeItemsFromCart(removeItems);
  }
}
