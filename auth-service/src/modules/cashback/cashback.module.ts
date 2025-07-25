import { Module } from '@nestjs/common';
import { CashbackService } from './cashback.service';
import { CashbackController } from './cashback.controller';
import { CashbackHistory } from './entities/cashback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { TokenService } from '../auth/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { RabbitMQModule } from '../rmq/rmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CashbackHistory]),
    UserModule,
    RabbitMQModule,
  ],
  controllers: [CashbackController],
  providers: [CashbackService, TokenService, JwtService],
  exports: [CashbackService],
})
export class CashbackModule {}
