import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Request } from 'express';
import { UpdateItemCartDto } from './dto/update-item-cart.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post('add-to-cart')
  async addToCart(
    @Body() body: AddToCartDto,
    @Req() req: Request,
  ): Promise<any> {
    const userId = req.headers['x-user-id'] as string;
    await this.cartService.addToCart({ ...body, userId });
    return { message: 'Success' };
  }
  @Get('get-cart')
  async getCart(@Req() req: Request): Promise<void> {
    const userId = req.headers['x-user-id'] as string;
    return this.cartService.getCart(userId);
  }
  @Post('remove-item')
  async removeFromCart(
    @Body() body: RemoveItemDto,
    @Req() req: Request,
  ): Promise<void> {
    const userId = req.headers['x-user-id'] as string;
    return this.cartService.removeFromCart({
      ...body,
      userId,
    });
  }

  @Patch('update-item')
  async updateItemCart(
    @Body() body: UpdateItemCartDto,
    @Req() req: Request,
  ): Promise<void> {
    const userId = req.headers['x-user-id'] as string;
    return this.cartService.updateItemCart({ ...body, userId });
  }
}
