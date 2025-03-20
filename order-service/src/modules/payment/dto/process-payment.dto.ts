export class ProcessPaymentDto {
  paymentMethod: string;
  orderIds: string[];
  total: number;
}
