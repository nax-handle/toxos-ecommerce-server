import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/modules/auth/services/token.service';
import { ShopService } from 'src/modules/shop/shop.service';
import { UserService } from 'src/modules/user/user.service';
@Injectable()
export class ShopGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly shopService: ShopService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(token, 'access');
    request['user'] = payload;
    const user = await this.userService.findUserById(
      payload.id,
      'Unauthorized',
    );
    const shop = await this.shopService.getShop(user);
    request['shop'] = shop;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
