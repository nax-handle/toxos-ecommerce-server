import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  @Roles('user')
  authGateway(@Req() req: Request, @Res() res: Response) {
    const user = req['user'] as User;
    res.setHeader('X-User-ID', user.id);
    return res.status(200).send();
  }
  @Get('user')
  @Roles('user')
  authUser(@Req() req: Request) {
    const user = req['user'] as User;
    return user;
  }
  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto);
    return {
      ...tokens,
      message: 'User logged in successfully',
      status: 200,
    };
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
