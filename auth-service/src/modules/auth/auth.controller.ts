import { Body, Controller, Post, Req } from '@nestjs/common';
// import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginDto: LoginDto) {
    const token = this.authService.login(loginDto);
    return {
      token: token,
      message: 'User logged in successfully',
      status: 200,
    };
  }
  @Post()
  @Roles('admin', 'user')
  // @UseGuards(AuthGuard)
  auth(@Req() req: Request) {
    return req['user'] as User;
  }
  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return {
      message: 'OK',
      status: 200,
    };
  }
  @Post('verify')
  async verifyUser(@Body() verify: VerifyOtpDto) {
    const token = await this.authService.verify(verify);
    return {
      token: token,
      message: 'OK',
      status: 200,
    };
  }
  // @Post('customer')
  // auth(data: { type: string } & LoginDto) {
  //   const token = this.authService.login(data.type, data);
  //   return {
  //     token: token,
  //     message: 'User logged in successfully',
  //     status: 200,
  //   };
  // }
  // @GrpcMethod('AuthService', 'Auth')
  // authUser(data: { email: string; password: string; type: string }) {
  //   const value = this.authService.login(data.type, data);
  //   return { token: null, data: value };
  // }
}
