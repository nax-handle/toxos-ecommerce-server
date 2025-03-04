import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ShopService } from './shop.service';
import { RegisterShopDto } from './dto/register-shop.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { ShopGuard } from 'src/common/guards/shop.guard';
import { Shop } from './entities/shop.entity';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('register')
  @UseGuards(AuthGuard)
  registerShop(@Body() registerShopDto: RegisterShopDto, @Req() req: Request) {
    return this.shopService.registerShop({
      ...registerShopDto,
      user: req['user'] as User,
    });
  }
  @Get()
  @UseGuards(ShopGuard)
  getShop(@Req() req: Request) {
    return req['shop'] as Shop;
  }
}
