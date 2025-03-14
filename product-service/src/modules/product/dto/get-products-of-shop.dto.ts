import { IsNotEmpty } from 'class-validator';
export class GetProductsOfShopDto {
  page: number;
  size: number;
  @IsNotEmpty()
  shopId: string;
  filter: object;
}
