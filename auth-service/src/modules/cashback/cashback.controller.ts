import { Controller, Get, Req, Post, Body } from '@nestjs/common';
import { CashbackService } from './cashback.service';
import { CreateCashbackDto } from './dto/create-cashback.dto';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { EventPattern, Payload } from '@nestjs/microservices';
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
  @EventPattern('cashback.order')
  create(@Payload() createCashbackDto: string) {
    console.log('cash back cooking!');
    return this.cashbackService.create(
      JSON.parse(createCashbackDto) as CreateCashbackDto,
    );
  }
  @Get()
  @Roles('user')
  findAll(@Req() req: Request) {
    const user = req['user'] as User;
    return this.cashbackService.findAll(user.id);
  }
}
