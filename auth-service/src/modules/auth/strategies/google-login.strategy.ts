import { BadRequestException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { TokenDto } from '../dto/token.dto';
import { TokenService } from '../services/token.service';
import { ILoginStrategy } from './login-strategy.interface';
import { OAuth2Client } from 'google-auth-library';
import { GoogleConfig } from 'src/configs/google.config';
export class GoogleLoginStrategy implements ILoginStrategy {
  private oauth2Client: OAuth2Client;
  private tokenService: TokenService;
  constructor() {
    this.oauth2Client = new OAuth2Client(GoogleConfig);
  }

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const { code } = loginDto;
    const token = await this.oauth2Client.getToken(code);
    const idToken = token.tokens.id_token;
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: idToken as string,
      audience: GoogleConfig.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new BadRequestException('Login Fail');
    return await this.tokenService.generateToken(payload);
  }
}
