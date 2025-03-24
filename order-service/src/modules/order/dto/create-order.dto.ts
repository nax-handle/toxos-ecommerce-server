import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  note: string;
}

export class Shop {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  logo: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsOptional()
  productThumbnail: string;
  category: string;

  @IsNotEmpty()
  productId: string;

  @IsOptional()
  variantId: string;

  @IsString()
  @IsOptional()
  tags: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class Order {
  @ValidateNested()
  @Type(() => Shop)
  shop: Shop;

  totalPrice: number;

  paymentMethod: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}

export class CreateOrderDto {
  userId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Order)
  orders: Order[];
}
