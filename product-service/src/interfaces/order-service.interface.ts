import { Observable } from 'rxjs';

export interface OrdersResponse {
  allowed: boolean;
}

export interface OrderService {
  IsReviewAllowed(data: { id: string }): Observable<OrdersResponse>;
}
