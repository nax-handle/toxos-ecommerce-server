import { LoginDto } from '../dto/login.dto';
import { TokenDto } from '../dto/token.dto';
import { ILoginStrategy } from './login-strategy.interface';

export class FacebookLoginStrategy implements ILoginStrategy {
  login(loginDto: LoginDto): Promise<TokenDto> {
    console.log(loginDto);
    return Promise.resolve({
      accessToken: 'string',
      refreshToken: 'string',
    });
  }
}
