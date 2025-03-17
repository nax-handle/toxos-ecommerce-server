import { UserService } from 'src/modules/user/user.service';
import { LoginDto } from '../dto/login.dto';
import { ILoginStrategy } from './login-strategy.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { comparePassword } from 'src/utils/hash.util';
import { TokenService } from '../services/token.service';
import { TokenDto } from '../dto/token.dto';
export class EmailLoginStrategy implements ILoginStrategy {
  constructor(
    @Inject() private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}
  async login(loginDto: LoginDto): Promise<TokenDto> {
    const { email, password } = loginDto;
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new BadRequestException('Tài khoản hoặc mật khẩu sai');
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword)
      throw new BadRequestException('Tài khoản hoặc mật khẩu sai');
    const tokens = await this.tokenService.generateToken({ ...user });
    return { user, ...tokens };
  }
}
