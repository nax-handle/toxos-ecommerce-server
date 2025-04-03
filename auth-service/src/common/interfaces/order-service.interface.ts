import { Observable } from 'rxjs';
import { Order } from 'src/modules/report/interface/order.interface';

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderService {
  GetOrdersByShopId(data: {
    fromDate: string;
    toDate: string;
    shopId: string;
  }): Observable<OrdersResponse>;
}
