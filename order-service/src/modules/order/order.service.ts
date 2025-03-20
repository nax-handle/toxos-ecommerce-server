import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { CashBackCalculator } from './visitor/cash-back.visitor';
import { OrderVisitor } from './visitor/order.visitor';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ClientGrpc,
  ClientProxy,
  RmqRecordBuilder,
} from '@nestjs/microservices';
import { OrderItem } from './entities/order-item.entity';
import { GetOrdersDto } from './dto/get-orders.dto';
import { PaginationResultDto } from './dto/response/pagination.dto';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { Observable } from 'rxjs';
import { ProductService } from 'src/interfaces/grpc/product-service.interface';

@Injectable()
export class OrderService {
  private productService: ProductService;
  constructor(
    @Inject('GRPC_PRODUCT_SERVICE') private clientProduct: ClientGrpc,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,
  ) {}
  // @Inject('RMQ_SERVICE') private readonly client: ClientProxy;
  onModuleInit() {
    this.productService =
      this.clientProduct.getService<ProductService>('ProductService');
  }
  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['orderItems'],
    });
    if (!order) throw new BadGatewayException('Order not found');
    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<string> {
    const allProducts = createOrderDto.orders.flatMap((order) =>
      order.orderItems.map((item) => ({
        ...item,
        userId: createOrderDto.userId,
        shopId: order.shop.id,
      })),
    );
    this.productService
      .checkStockAndPrice({ products: allProducts })
      .subscribe((result) => {
        if (!result.items.inStock) {
          return result.items.outOfStock;
        }
        if (!result.items.price) {
          return result.items.priceFluctuations;
        }
      });
    let totalOrders = 0;
    const insertOrders = createOrderDto.orders.map((order) => {
      const orderItemsWithPrice = order.orderItems.map((item) => {
        const product = allProducts.find((p) => p.productId === item.productId);
        const price = product?.price || 0;
        return {
          ...item,
          price,
          total: price * item.quantity,
        };
      });
      const totalPrice = orderItemsWithPrice.reduce(
        (sum, item) => sum + item.total,
        0,
      );
      totalOrders += totalPrice;
      return {
        ...order,
        userId: createOrderDto.userId,
        paymentMethod: createOrderDto.paymentMethod,
        totalPrice,
        orderItems: orderItemsWithPrice,
      };
    });
    const orders = insertOrders.map((orderData) =>
      this.orderRepository.create({
        ...orderData,
        orderItems: orderData.orderItems.map((item) =>
          this.orderItemRepository.create(item),
        ),
      }),
    );
    const [_, savedOrders] = await Promise.all([
      this.cartService.removeItemsFromCart(allProducts),
      this.orderRepository.save(orders),
    ]);
    return await this.paymentService.processPayment({
      paymentMethod: createOrderDto.paymentMethod,
      total: totalOrders,
      orderIds: savedOrders.map((order) => order.id),
    });
  }
  // async calculateLoyaltyPoints() {
  //   const orders = await this.getOrders('1');
  //   const order = new OrderVisitor(orders);
  //   const cashBackCalculator = new CashBackCalculator();
  //   return order.getTotalCashBack(cashBackCalculator);
  // }
  async getOrders(
    getOrders: GetOrdersDto,
  ): Promise<PaginationResultDto<Order>> {
    const { limit, page, userId } = getOrders;
    const [orders, total] = await this.orderRepository.findAndCount({
      where: {
        userId: userId,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
