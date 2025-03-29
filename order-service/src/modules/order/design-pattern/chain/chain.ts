// import { CreateOrderDto } from '../../dto/create-order.dto';
// import { StockAndPriceCheckHandler } from './hanlder/check-stock-and-price.hanlder';

// export class ChainOfOrder {
//   async handler(createOrderDto: CreateOrderDto): Promise<string> {
//     const allProducts = createOrderDto.orders.flatMap((order) =>
//       order.orderItems.map((item) => ({
//         ...item,
//         userId: createOrderDto.userId,
//         shop: order.shop,
//         shopId: order.shop.id,
//       })),
//     );

//     const request: OrderRequest = { createOrderDto, allProducts };

//     // Khởi tạo các handler
//     const stockHandler = new StockAndPriceCheckHandler(this.productService);
//     // const calculationHandler = new OrderCalculationHandler();
//     // const persistenceHandler = new OrderPersistenceHandler(
//     //   this.orderRepository,
//     //   this.orderItemRepository,
//     // );
//     // const cartHandler = new CartCleanupHandler(this.cartService);
//     // const paymentHandler = new PaymentProcessingHandler(this.paymentService);

//     // Xâu chuỗi các handler
//     // stockHandler
//     //   .setNext(calculationHandler)
//     //   .setNext(persistenceHandler)
//     //   .setNext(cartHandler)
//     //   .setNext(paymentHandler);

//     // Xử lý đơn hàng
//     await stockHandler.handle(request);

//     return request.paymentResult;
//   }
// }
