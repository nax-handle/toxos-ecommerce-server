import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { CashbackService } from './cashback.service';
import { CreateCashbackDto } from './dto/create-cashback.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller('cashback')
export class CashbackController {
  constructor(private readonly cashbackService: CashbackService) {}

  @MessagePattern('update.cashback')
  create(@Payload() createCashbackDto: CreateCashbackDto) {
    return this.cashbackService.create({
      ...createCashbackDto,
    });
  }
  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request) {
    const user = req['user'] as User;
    return this.cashbackService.findAll(user.id);
  }
}
