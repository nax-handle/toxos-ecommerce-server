import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CashBackCalculator } from './design-pattern/visitor/cash-back.visitor';
import { OrderVisitor } from './design-pattern/visitor/order.visitor';
import { Order } from './entities/order.entity';
import { Between, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { OrderItem } from './entities/order-item.entity';
import { GetOrdersDto } from './dto/request/get-orders.dto';
import { PaginationResultDto } from './dto/response/pagination.dto';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { firstValueFrom } from 'rxjs';
import { ProductService } from 'src/interfaces/grpc/product-service.interface';
import { StripeService } from '../payment/services/stripe.service';
import { ORDER_STATUS } from 'src/constants/order-status';
import { GetOrdersShopDto } from './dto/request/get-orders-shop.dto';
import { SHIPPING_STATUS } from 'src/constants/shipping-status';
import { GetReportShopDto } from './dto/request/get-report-shop.dto';

@Injectable()
export class OrderService {
  private productService: ProductService;
  constructor(
    @Inject('RMQ_PRODUCT') private readonly clientRmqProduct: ClientProxy,
    @Inject('RMQ_AUTH') private readonly clientRmqAuth: ClientProxy,
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
        shop: order.shop,
        shopId: order.shop.id,
      })),
    );
    let checkResult;
    try {
      checkResult = await firstValueFrom(
        this.productService.checkStockAndPrice({ products: allProducts }),
      );
      console.log(checkResult);
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
        address: createOrderDto.address,
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
    const { limit, page, userId, status, shippingStatus } = getOrders;
    const [orders, total] = await this.orderRepository.findAndCount({
      where: {
        userId: userId,
        ...(status !== undefined ? { status } : {}),
        ...(shippingStatus !== undefined ? { shippingStatus } : {}),
      },
      relations: ['orderItems'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    console.log(orders);
    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async cashBackOrder(orderIds: string[]) {
    const orders = await this.getOrderByIds(orderIds);
    await this.orderRepository.update(
      { id: In(orderIds) },
      { status: ORDER_STATUS.PAID },
    );
    const totalCashBack = orders.reduce((total, order) => {
      const orderVisitor = new OrderVisitor(order);
      const cashBackCalculator = new CashBackCalculator();
      const orderCashBack = orderVisitor.getTotalCashBack(cashBackCalculator);
      return total + orderCashBack;
    }, 0);
    console.log(totalCashBack);
    if (totalCashBack > 0) {
      this.clientRmqAuth
        .emit(
          'cashback_order',
          JSON.stringify({
            userId: orders[0].userId,
            amount: totalCashBack,
            type: 'order',
            orderIds,
          }),
        )
        .subscribe((error) => {
          //refund
          console.log(error);
        });
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
    this.clientRmqProduct
      .emit('update_stock', { orderIds, items: productsToUpdate })
      .subscribe({
        error: (err) => {
          //REFUND MONEY
          console.error('Failed to send message:', err);
        },
      });
  }
  async getOrdersShop(
    getOrders: GetOrdersShopDto,
  ): Promise<PaginationResultDto<Order>> {
    const { limit, page, shopId } = getOrders;
    const [orders, total] = await this.orderRepository.findAndCount({
      where: {
        shopId: shopId,
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
  async getOrderShopDetails(shopId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { shopId: shopId, id: orderId },
      relations: ['orderItems'],
    });
    if (!order) throw new BadRequestException('Không tìm thấy order');
    return order;
  }
  async setOrderPackedStatus(shopId: string, orderId: string): Promise<Order> {
    const order = await this.getOrderShopDetails(shopId, orderId);
    if (
      order.status !== ORDER_STATUS.COD_PENDING &&
      order.status !== ORDER_STATUS.PAID
    ) {
      throw new BadRequestException('Cập nhật trạng thái gói hàng thất bại');
    }
    order.shippingStatus = SHIPPING_STATUS.PACKED;
    await this.orderRepository.save(order);
    return order;
  }
  async isReviewAllowed(id: string): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: {
        id: id,
      },
    });
    if (
      !(
        order &&
        order.shippingStatus === SHIPPING_STATUS.DELIVERED &&
        order.isReview === true
      )
    ) {
      return false;
    }
    order.isReview = false;
    await this.orderRepository.save(order);
    return true;
  }
  async getOrdersByShopId(getReportData: GetReportShopDto): Promise<Order[]> {
    const { fromDate, toDate } = getReportData;
    return await this.orderRepository.find({
      where: {
        createdAt: Between(new Date(fromDate), new Date(toDate)),
      },
      order: { createdAt: 'DESC' },
      relations: ['orderItems'],
    });
  }
}
