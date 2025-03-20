import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { TokenService } from '../auth/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UserModule],
  controllers: [AddressController],
  providers: [AddressService, TokenService, JwtService],
})
export class AddressModule {}
