import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationResultDto } from './dto/response/pagination.dto';
import { Order } from './entities/order.entity';
import { StripeService } from '../payment/services/stripe.service';
import { Request, Response } from 'express';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly stripeService: StripeService,
  ) {}
  @Post('create')
  async create(@Body() body: CreateOrderDto, @Req() req: Request) {
    const userId = req.headers['x-user-id'] as string;
    return {
      message: 'success',
      url: await this.orderService.createOrder({ ...body, userId: userId }),
    };
  }
  @Get()
  async getOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResultDto<Order>> {
    const userId = 'user456';
    return this.orderService.getOrders({
      limit: Number(limit),
      page: Number(page),
      userId: userId,
    });
  }
  @Post('webhook/stripe')
  async webhookStripe(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) {
      return res.status(400).send('Raw body not found');
    }
    await this.orderService.webhookStripe(req.rawBody, signature);
    return res.status(200).send('Webhook received');
  }
  @EventPattern('order.paid')
  async cashBackOrder(@Payload() body: string[]) {
    await this.orderService.cashBackOrder(body);
  }
  @Get('shop')
  async getOrdersShop(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
  ): Promise<PaginationResultDto<Order>> {
    const shopId = req.headers['x-shop-id'] as string;
    return this.orderService.getOrdersShop({
      limit: Number(limit),
      page: Number(page),
      shopId: shopId,
    });
  }
}
