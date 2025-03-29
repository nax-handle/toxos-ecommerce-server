import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RegisterShopDto } from '../shop/dto/register-shop.dto';
import { ShopService } from '../shop/shop.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly shopService: ShopService,
  ) {}
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
  @Post('shop/register')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  registerShop(
    @Body() registerShopDto: RegisterShopDto,
    @Req() req: Request,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File;
    },
  ) {
    return this.shopService.registerShop({
      ...registerShopDto,
      user: req['user'] as User,
      file: files.logo?.[0] as Express.Multer.File,
    });
  }
}
