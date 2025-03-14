import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { RegisterShopDto } from './dto/register-shop.dto';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { ShopGuard } from 'src/common/guards/shop.guard';
import { Shop } from './schemas/shop.schema';
import { response, Response } from 'src/utils/response';

interface RequestWithShop extends Request {
  shop: Shop;
}

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('register')
  // @UseGuards(AuthGuard)
  registerShop(@Body() registerShopDto: RegisterShopDto, @Req() req: Request) {
    console.log(req.headers['x-user-id']);
    return this.shopService.registerShop({
      ...registerShopDto,
      userId: req.headers['x-user-id'] as string,
    });
  }
  @Get('dashboard')
  @UseGuards(ShopGuard)
  getOwnShop(@Req() req: RequestWithShop) {
    //get dashboard
    return req.shop;
  }
  @Get(':slug')
  @UseGuards(ShopGuard)
  async getShopBySlug(
    @Param() params: { slug: string },
  ): Promise<Response<Shop>> {
    const { slug } = params;
    const data = await this.shopService.getShopBySlug(slug);
    return response(data, 'success');
  }
  // @Get()
  // @UseGuards(ShopGuard)
  // getShop(@Req() req: Request) {
  //   return req['shop'] as Shop;
  // }
}
