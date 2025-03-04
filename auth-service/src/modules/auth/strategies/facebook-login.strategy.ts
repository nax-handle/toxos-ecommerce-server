import { LoginDto } from '../dto/login.dto';
import { ILoginStrategy } from './login-strategy.interface';

export class FacebookLoginStrategy implements ILoginStrategy {
  login(loginDto: LoginDto): Promise<string> {
    return Promise.resolve('Logged in with Facebook');
  }
}
