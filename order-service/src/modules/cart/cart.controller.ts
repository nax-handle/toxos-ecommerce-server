import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { Request } from '@nestjs/common';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Get()
  test(@Req() req: Request) {
    const userId = req.headers['x-user-id'];
    console.log(userId);
  }
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
  @Patch()
  async updateItemCart(@Body() body: AddToCartDto): Promise<void> {
    return this.cartService.updateItemCart(body);
  }
}
