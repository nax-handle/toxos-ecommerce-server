import { LoginDto } from '../dto/login.dto';
import { ILoginStrategy } from './login-strategy.interface';

export class EmailLoginStrategy implements ILoginStrategy {
  login(loginDto: LoginDto): Promise<string> {
    console.log(loginDto);
    return Promise.resolve('Logged in with email');
  }
}
