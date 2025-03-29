// import { ProductService } from 'src/interfaces/grpc/product-service.interface';
// import { OrderHandler } from '../order-handler.interface';
// import { CreateOrderDto } from 'src/modules/order/dto/create-order.dto';
// import { BadRequestException } from '@nestjs/common';
// import { firstValueFrom } from 'rxjs';

// export class StockAndPriceCheckHandler implements OrderHandler {
//   private nextHandler?: OrderHandler;

//   constructor(private productService: ProductService) {}

//   setNext(handler: OrderHandler): OrderHandler {
//     this.nextHandler = handler;
//     return handler;
//   }

//   async handle(request: CreateOrderDto): Promise<void> {
//     try {
//       const allProducts = request.orders.flatMap((order) =>
//         order.orderItems.map((item) => ({
//           ...item,
//           userId: request.userId,
//           shop: order.shop,
//           shopId: order.shop.id,
//         })),
//       );
//       const checkResult = await firstValueFrom(
//         this.productService.checkStockAndPrice({
//           products: allProducts,
//         }),
//       );

//       if (!checkResult.inStock) {
//         throw new BadRequestException(
//           `Out of stock: ${checkResult.items.outOfStock.join(', ')}`,
//         );
//       }
//       if (!checkResult.price) {
//         throw new BadRequestException(
//           `Price changed for: ${checkResult.items.priceFluctuations.join(', ')}`,
//         );
//       }
//     } catch (error) {
//       console.error('Error calling gRPC checkStockAndPrice:', error);
//       throw new BadRequestException('Unable to verify product stock and price');
//     }

//     if (this.nextHandler) {
//       await this.nextHandler.handle(request);
//     }
//   }
// }
