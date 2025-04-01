import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/email/email.module';
import { DatabaseModule } from './database/mysql.module';
import { RedisModule } from './database/redis.module';
import { AddressModule } from './modules/address/address.module';
import { RoleModule } from './modules/role/role.module';
import { ShopModule } from './modules/shop/shop.module';
import { CashbackModule } from './modules/cashback/cashback.module';
import { RabbitMQModule } from './modules/rmq/rmq.module';
import { ReportModule } from './modules/report/report.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    RedisModule,
    UserModule,
    EmailModule,
    DatabaseModule,
    AddressModule,
    RoleModule,
    ShopModule,
    CashbackModule,
    RabbitMQModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
