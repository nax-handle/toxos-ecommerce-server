import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CashBackCalculator } from './visitor/cash-back.visitor';
import { OrderVisitor } from './visitor/order.visitor';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { OrderItem } from './entities/order-item.entity';
import { GetOrdersDto } from './dto/get-orders.dto';
import { PaginationResultDto } from './dto/response/pagination.dto';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { firstValueFrom } from 'rxjs';
import { ProductService } from 'src/interfaces/grpc/product-service.interface';
import { StripeService } from '../payment/services/stripe.service';
import { ORDER_STATUS } from 'src/constants/order-status';

@Injectable()
export class OrderService {
  private productService: ProductService;
  constructor(
    @Inject('RMQ_SERVICE') private readonly client: ClientProxy,
    @Inject('GRPC_PRODUCT_SERVICE') private clientProduct: ClientGrpc,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly stripeService: StripeService,
    private readonly paymentService: PaymentService,
  ) {}
  onModuleInit() {
    this.productService =
      this.clientProduct.getService<ProductService>('ProductService');
  }
  async getOrderByIds(id: string[]): Promise<Order[]> {
    const order = await this.orderRepository.find({
      where: { id: In(id) },
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
    let checkResult;
    try {
      checkResult = await firstValueFrom(
        this.productService.checkStockAndPrice({ products: allProducts }),
      );
    } catch (error) {
      console.error('Error calling gRPC checkStockAndPrice:', error);
      throw new BadRequestException('Unable to verify product stock and price');
    }
    if (!checkResult.inStock) {
      throw new BadRequestException(
        `Out of stock: ${checkResult.items.outOfStock.join(', ')}`,
      );
    }
    if (!checkResult.price) {
      throw new BadRequestException(
        `Price changed for: ${checkResult.items.priceFluctuations.join(', ')}`,
      );
    }

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
    try {
      const [_, savedOrders] = await Promise.all([
        this.cartService.removeItemsFromCart(allProducts),
        this.orderRepository.save(orders),
      ]);

      return await this.paymentService.processPayment({
        paymentMethod: createOrderDto.paymentMethod,
        total: totalOrders,
        orderIds: savedOrders.map((order) => order.id),
      });
    } catch (error) {
      console.error('Error processing order:', error);
      throw new BadRequestException('Failed to create order');
    }
  }

  async webhookStripe(body: Buffer, signature: string) {
    const orderIds = await this.stripeService.handleWebhook(body, signature);
    const orders = await this.getOrderByIds(orderIds);
    const productsToUpdate = orders.flatMap((order) =>
      order.orderItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    );
    this.client
      .connect()
      .then(() => {
        console.log('Connected to RabbitMQ');
      })
      .catch((err) => {
        console.error('Failed to connect to RabbitMQ:', err);
      });
    this.client
      .send('update.stock', { orderIds, items: productsToUpdate })
      .subscribe({
        next: (response) => {
          console.log('Message sent successfully:', response);
        },
        error: (err) => {
          console.error('Failed to send message:', err);
        },
      });
  }
  async updateOrdersPaid(orderIds: string[]) {
    await this.orderRepository.update(
      { id: In(orderIds) },
      { status: ORDER_STATUS.PAID },
    );
  }
  async updateOrdersFail(orderIds: string[]) {
    await this.orderRepository.update(
      { id: In(orderIds) },
      { status: ORDER_STATUS.CANCELLED },
    );
  }
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
  // async calculateLoyaltyPoints() {
  // this.orderRepository.update(
  //       { id: In(orderIds) },
  //       { status: ORDER_STATUS.PAID },
  //     )
  //   const orders = await this.getOrders('1');
  //   const order = new OrderVisitor(orders);
  //   const cashBackCalculator = new CashBackCalculator();
  //   return order.getTotalCashBack(cashBackCalculator);
  // }
}
