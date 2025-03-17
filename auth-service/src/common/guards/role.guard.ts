import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from 'src/modules/auth/services/token.service';
import { UserService } from 'src/modules/user/user.service';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || roles.length === 0) {
      throw new UnauthorizedException('No token provided');
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const payload = await this.tokenService.verifyToken(token, 'access');
    request['user'] = payload;

    // const user = await this.userService.findUserById(
    await this.userService.findUserById(payload.id, 'Unauthorized');

    // const hasRole = roles.some((role) => user.roles.includes(role));
    // if (!hasRole) {
    //   throw new UnauthorizedException('Insufficient permissions');
    // }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
