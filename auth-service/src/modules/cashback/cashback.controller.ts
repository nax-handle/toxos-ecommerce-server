import { Controller, Get, Req } from '@nestjs/common';
import { CashbackService } from './cashback.service';
import { CreateCashbackDto } from './dto/create-cashback.dto';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Roles } from 'src/common/decorators/role.decorator';
@Controller('cashback')
export class CashbackController {
  constructor(private readonly cashbackService: CashbackService) {}
  @EventPattern('cashback_order')
  create(@Payload() createCashbackDto: string) {
    console.log('cash back cooking!');
    return this.cashbackService.create(
      JSON.parse(createCashbackDto) as CreateCashbackDto,
    );
  }
  @Get('get-histories')
  @Roles('user')
  findAll(@Req() req: Request) {
    const user = req['user'] as User;
    return this.cashbackService.findAll(user.id);
  }
}
