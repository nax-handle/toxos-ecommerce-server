import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ShopService } from 'src/modules/shop/shop.service';

interface RequestWithUser extends Request {
  headers: {
    'x-user-id'?: string;
  };
}

@Injectable()
export class ShopGuard implements CanActivate {
  constructor(private readonly shopService: ShopService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.headers['x-user-id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }
    const shop = await this.shopService.getOwnShop(userId);
    request['shop'] = shop;
    return true;
  }
}
