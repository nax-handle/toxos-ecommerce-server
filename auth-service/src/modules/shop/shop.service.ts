import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterShopDto } from './dto/register-shop.dto';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async registerShop(registerShopDto: RegisterShopDto): Promise<Shop> {
    const data = this.shopRepository.create(registerShopDto);
    return await this.shopRepository.save(data);
  }
  async getShop(user: User): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
    if (!shop) throw new NotFoundException();
    return shop;
  }
}
