import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
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
    console.log(token);
    const payload = await this.tokenService.verifyToken(token, 'access');
    const user = await this.userService.findUserById(
      payload.id,
      'Unauthorized',
    );
    if (!user) throw new UnauthorizedException();
    request['user'] = user;
    const shop = await this.shopService.getShop(user);
    if (!shop) throw new ForbiddenException();
    request['shop'] = shop;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
