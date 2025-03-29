import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { Express } from 'express';

export class RegisterShopDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên cửa hàng không được để trống' })
  name: string;

  @IsString()
  @IsOptional()
  logo: string;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @IsString()
  @IsOptional()
  detailedAddress: string;

  user: User;

  @IsOptional()
  file: Express.Multer.File;
}
