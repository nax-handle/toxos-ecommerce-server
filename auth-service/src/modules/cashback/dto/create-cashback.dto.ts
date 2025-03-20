import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateCashbackDto {
  @IsUUID('4', { message: 'User ID phải là UUID hợp lệ' })
  @IsNotEmpty({ message: 'User ID không được để trống' })
  userId: string;

  @IsNumber({}, { message: 'Số tiền cashback phải là số' })
  @Min(0, { message: 'Số tiền cashback phải lớn hơn hoặc bằng 0' })
  @IsNotEmpty({ message: 'Số tiền cashback không được để trống' })
  amount: number;

  @IsString({ message: 'Loại cashback phải là chuỗi' })
  @IsNotEmpty({ message: 'Loại cashback không được để trống' })
  type: string;
  @IsOptional()
  @IsUUID('4', { each: true, message: 'Mỗi referenceId phải là UUID hợp lệ' })
  referenceId?: string[];
}
