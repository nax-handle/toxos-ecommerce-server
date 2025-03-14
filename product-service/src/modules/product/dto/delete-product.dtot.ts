import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class DeleteProductDto {
  @IsNotEmpty()
  shopId: Types.ObjectId;
  @IsString()
  @IsNotEmpty()
  productId: string;
}
