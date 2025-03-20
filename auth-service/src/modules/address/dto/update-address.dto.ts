import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

export class UpdateAddressDto {
  @IsNotEmpty()
  readonly user: User;

  @IsOptional()
  @IsString({ message: 'Đường phố phải là chuỗi ký tự' })
  readonly street?: string;

  @IsOptional()
  @IsString({ message: 'Phường phải là chuỗi ký tự' })
  readonly ward?: string;

  @IsOptional()
  @IsString({ message: 'Quận/Huyện phải là chuỗi ký tự' })
  readonly district?: string;
  @IsOptional()
  @IsString({ message: 'Thành phố phải là chuỗi ký tự' })
  readonly city?: string;

  @IsOptional()
  @IsString({ message: 'Bang/tỉnh phải là chuỗi ký tự' })
  readonly state?: string;

  @IsOptional()
  @IsString({ message: 'Quốc gia phải là chuỗi ký tự' })
  readonly country?: string;

  @IsOptional()
  @IsString({ message: 'Mã bưu điện phải là chuỗi ký tự' })
  readonly postalCode?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Vĩ độ phải là một số' })
  readonly latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Kinh độ phải là một số' })
  readonly longitude?: number;

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  readonly note?: string;
}
