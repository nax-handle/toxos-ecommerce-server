export class GetOrdersDto {
  page: number;
  limit: number;
  userId: string;
  status: string;
  shippingStatus: string;
}
