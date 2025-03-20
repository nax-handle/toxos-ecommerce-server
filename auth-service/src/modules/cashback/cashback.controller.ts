import { Controller, Get, Req, Post, Body } from '@nestjs/common';
import { CashbackService } from './cashback.service';
import { CreateCashbackDto } from './dto/create-cashback.dto';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Roles } from 'src/common/decorators/role.decorator';
@Controller('cashback')
export class CashbackController {
  constructor(private readonly cashbackService: CashbackService) {}
  @Post()
  @Roles('user')
  createTest(
    @Body() createCashbackDto: CreateCashbackDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as User;
    return this.cashbackService.create({
      ...createCashbackDto,
      userId: user.id,
    });
  }
  @MessagePattern('cashback.order')
  create(@Payload() createCashbackDto: CreateCashbackDto) {
    return this.cashbackService.create({
      ...createCashbackDto,
    });
  }
  @Get()
  @Roles('user')
  findAll(@Req() req: Request) {
    const user = req['user'] as User;
    return this.cashbackService.findAll(user.id);
  }
}
