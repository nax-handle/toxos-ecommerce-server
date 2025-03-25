import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  userId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsString()
  variantId?: string;

  @IsInt()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  shopId: string;
}
