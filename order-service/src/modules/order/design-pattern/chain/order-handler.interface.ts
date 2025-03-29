import { CreateOrderDto } from '../../dto/create-order.dto';

export interface OrderHandler {
  setNext(handler: OrderHandler): OrderHandler;
  handle(createOrderDto: CreateOrderDto): Promise<void>;
}
