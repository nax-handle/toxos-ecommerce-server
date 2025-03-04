import { LoginDto } from '../dto/login.dto';
export interface ILoginStrategy {
  login(loginDto: LoginDto): Promise<string>;
}
