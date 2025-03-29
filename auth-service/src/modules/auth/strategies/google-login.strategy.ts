import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { TokenDto } from '../dto/token.dto';
import { TokenService } from '../services/token.service';
import { ILoginStrategy } from './login-strategy.interface';
import { OAuth2Client } from 'google-auth-library';
import { GoogleConfig } from 'src/configs/google.config';

@Injectable()
export class GoogleLoginStrategy implements ILoginStrategy {
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly googleConfig: GoogleConfig,
    private readonly tokenService: TokenService,
  ) {
    this.oauth2Client = new OAuth2Client(
      this.googleConfig.clientId,
      this.googleConfig.clientSecret,
      this.googleConfig.redirectUri,
    );
  }

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const { code } = loginDto;
    console.log(code);
    const token = await this.oauth2Client.getToken(code);
    const idToken = token.tokens.id_token;

    if (!idToken) {
      throw new BadRequestException('Invalid Google token');
    }

    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: this.googleConfig.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new BadRequestException('Login Fail');
    return await this.tokenService.generateToken(payload);
  }
}
