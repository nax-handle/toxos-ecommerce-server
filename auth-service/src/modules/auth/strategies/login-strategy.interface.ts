import { LoginDto } from '../dto/login.dto';
import { TokenDto } from '../dto/token.dto';
export interface ILoginStrategy {
  login(loginDto: LoginDto): Promise<TokenDto>;
}
