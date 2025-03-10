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
import { Voucher } from './interfaces/cart.interface';
import { AddToCartDto } from './dtos/add-to-cart.dto';

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
  async addToCart(@Param('userId') userId: string, @Body() body: AddToCartDto) {
    const { productId } = body;
    return this.cartService.addToCart(userId, body, productId);
  }

  @Delete(':userId/items/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Put(':userId/items/:productId')
  async updateCartItemQuantity(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() { quantity }: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItemQuantity(userId, productId, quantity);
  }

  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }

  @Post(':userId/voucher')
  async applyVoucher(
    @Param('userId') userId: string,
    @Body() voucher: Voucher,
  ) {
    // await this.cartService.applyVoucher(voucher);
    return this.cartService.getCart(userId);
  }
}
