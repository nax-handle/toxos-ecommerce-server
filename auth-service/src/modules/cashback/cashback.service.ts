import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCashbackDto } from './dto/create-cashback.dto';
import { CashbackHistory } from './entities/cashback.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class CashbackService {
  constructor(
    @InjectRepository(CashbackHistory)
    private cashbackRepository: Repository<CashbackHistory>,
    private userService: UserService,
  ) {}

  async create(createCashbackDto: CreateCashbackDto): Promise<void> {
    const newCashback = this.cashbackRepository.create(createCashbackDto);
    console.log(newCashback);
    await Promise.all([
      await this.cashbackRepository.save(newCashback),
      await this.userService.updateBalanceCashback(
        createCashbackDto.amount,
        createCashbackDto.userId,
      ),
    ]);
  }
  async findAll(userId: string, page = 1, limit = 10) {
    const [result, total] = await this.cashbackRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
