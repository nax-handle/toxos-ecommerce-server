import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationResultDto } from './dto/response/pagination.dto';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('create')
  async create(@Body() body: CreateOrderDto) {
    return {
      message: 'success',
      point: await this.orderService.createOrder(body),
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
}
