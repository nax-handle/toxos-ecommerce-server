import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { LoginStrategy } from './strategies/login-strategy.factory';
import { EmailService } from '../email/email.service';
import { UserModule } from '../user/user.module';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLoginStrategy } from './strategies/email-login.strategy';
import { GoogleLoginStrategy } from './strategies/google-login.strategy';
import { FacebookLoginStrategy } from './strategies/facebook-login.strategy';
import { RabbitMQModule } from '../rmq/rmq.module';
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    RabbitMQModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    OtpService,
    TokenService,
    JwtService,
    LoginStrategy,
    ConfigService,
    RolesGuard,
    UserService,
    EmailLoginStrategy,
    GoogleLoginStrategy,
    FacebookLoginStrategy,
  ],
})
export class AuthModule {}
