export class GetProductDto {
  page: number;
  size: number;
  shopId?: string;
  filter?: object;
}
