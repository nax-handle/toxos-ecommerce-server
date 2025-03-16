import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { Request } from 'express';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  // userId = req.headers['x-user-id'];
  @Post()
  async addToCart(
    @Body() body: AddToCartDto,
    @Req() req: Request,
  ): Promise<void> {
    const userId = req.headers['x-user-id'] as string;
    return this.cartService.addToCart({ ...body, userId });
  }

  @Get()
  async getCart(@Req() req: Request): Promise<void> {
    const userId = req.headers['x-user-id'] as string;
    return this.cartService.getCart(userId);
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
