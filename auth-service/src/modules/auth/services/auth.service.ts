import { Injectable } from '@nestjs/common';
import { LoginStrategy } from '../strategies/login-strategy.factory';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserService } from '../../user/user.service';
import { OtpService } from './otp.service';
import { EmailService } from 'src/modules/email/email.service';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { TokenService } from './token.service';
import { TokenDto } from '../dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginStrategyFactory: LoginStrategy,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}
  login(loginDto: LoginDto): Promise<string> {
    const strategy = this.loginStrategyFactory.getStrategy(loginDto.type);
    return strategy.login(loginDto);
  }
  async register(register: RegisterDto): Promise<void> {
    const { email, password } = register;
    await this.userService.checkExistsAndThrow(email);
    const otp = await this.otpService.generateOtp(email, password);
    await this.emailService.sendEmail(email, otp, '[Curxor] Verify your email');
  }
  async verify(verify: VerifyOtpDto): Promise<TokenDto> {
    const { email } = verify;
    const password = await this.otpService.verifyOtp(verify);
    const user = await this.userService.create({ email, password });
    return await this.tokenService.generateToken(user);
  }
}
