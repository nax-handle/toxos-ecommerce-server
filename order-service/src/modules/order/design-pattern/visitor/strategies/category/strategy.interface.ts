import { OrderItem } from "src/modules/order/entities/order-item.entity";

export interface CashBackStrategy {
  calculate(orderItem: OrderItem): number;
}
