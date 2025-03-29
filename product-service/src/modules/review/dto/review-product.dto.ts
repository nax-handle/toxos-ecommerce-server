import {
  IsInt,
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class ReviewProductDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsString()
  userName: string;

  @IsUrl()
  userAvatar: string;

  @IsDateString()
  date: string;

  @IsString()
  variation: string;

  @IsString()
  product: string;

  orderId: string;
  shopId: string;
  userId: string;
}
