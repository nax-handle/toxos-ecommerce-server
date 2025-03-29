import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { TokenService } from '../auth/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, User])],
  controllers: [ShopController],
  providers: [
    ShopService,
    TokenService,
    JwtService,
    UserService,
    CloudinaryService,
  ],
  exports: [ShopService],
})
export class ShopModule {}
