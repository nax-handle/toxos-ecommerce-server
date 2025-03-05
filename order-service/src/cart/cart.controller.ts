import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';

class AddToCartDto {
  productId: string;
  quantity: number;
}

class UpdateCartItemDto {
  quantity: number;
}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post(':userId/items')
  async addToCart(
    @Param('userId') userId: string,
    @Body() { productId, quantity }: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Delete(':userId/items/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
