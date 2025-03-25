import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateItemCartDto {
  userId: string;

  @IsString()
  @IsNotEmpty()
  shopId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsString()
  oldVariantId?: string;

  @IsOptional()
  @IsString()
  newVariantId?: string;
}
