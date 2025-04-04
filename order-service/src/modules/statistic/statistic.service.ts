import { Injectable } from '@nestjs/common';
// import { OrderService } from '../order/order.service';

@Injectable()
export class StatisticService {
  // constructor(private readonly orderService: OrderService) {}
  async getStatistic() {
    // return await this.orderService.getOrderStatistics({
    //   shopId: '28281d3a-2924-4e30-b539-84185ee94b52',
    //   fromDate: '2025-03-21 12:15:23.511817',
    //   toDate: '2025-04-01 12:15:23.511817',
    // });
  }
}
