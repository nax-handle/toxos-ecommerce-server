import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopGuard } from 'src/common/guards/shop.guard';
import { Shop } from './entities/shop.entity';
import { Request, Response } from 'express';
import { GrpcMethod } from '@nestjs/microservices';
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Get('auth')
  @UseGuards(ShopGuard)
  authShop(@Req() req: Request, @Res() res: Response) {
    const shop = req['shop'] as Shop;
    res.setHeader('X-Shop-ID', shop.id);
    console.log(res.getHeader('x-shop-id'));
    return res.status(200).send();
  }

  @Get()
  @UseGuards(ShopGuard)
  getShop(@Req() req: Request) {
    return req['shop'] as Shop;
  }

  @Get(':id')
  getShopById(@Param() params: { id: string }): Promise<Shop> {
    return this.shopService.getShopById(params.id);
  }
  @GrpcMethod('ShopService', 'FindMany')
  async findMany(data: { ids: string[] }) {
    const items = await this.shopService.findMany(data.ids);
    return { shops: items };
  }
  @GrpcMethod('ShopService', 'FindOne')
  async findOne(data: { id: string }) {
    const items = await this.shopService.findOne(data.id);
    return items;
  }
}
