import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { RegisterShopDto } from './dto/register-shop.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from '../user/entities/user.entity';
import { ShopGuard } from 'src/common/guards/shop.guard';
import { Shop } from './entities/shop.entity';
import { Request, Response } from 'express';
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Post('auth')
  @UseGuards(ShopGuard)
  authShop(@Req() req: Request, @Res() res: Response) {
    const shop = req['shop'] as Shop;
    res.setHeader('X-Shop-ID', shop.id);
    return res.status(200);
  }
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
