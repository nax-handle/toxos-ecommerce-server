import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../dto/token.dto';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: Record<string, any>): Promise<TokenDto> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'access',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'refresh',
    });
    return { accessToken, refreshToken };
  }

  verifyToken(token: string, secret: string): Promise<User> {
    try {
      return this.jwtService.verify(token, { secret: secret });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
