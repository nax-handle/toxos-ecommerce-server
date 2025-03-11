import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string): Promise<void> {
    return this.cartService.getCart(userId);
  }

  @Post(':userId/items')
  async addToCart(
    @Param('userId') userId: string,
    @Body() body: AddToCartDto,
  ): Promise<void> {
    return this.cartService.addToCart(userId, body);
  }

  @Delete()
  async removeFromCart(@Body() body: AddToCartDto): Promise<void> {
    return this.cartService.removeFromCart(body);
  }
}
