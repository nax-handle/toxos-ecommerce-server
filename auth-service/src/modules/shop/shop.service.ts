import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterShopDto } from './dto/register-shop.dto';
import { Shop } from './entities/shop.entity';
import { In, Repository } from 'typeorm';
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
  async getShop(user: User): Promise<Shop | null> {
    const shop = await this.shopRepository.findOne({
      where: { user: user },
      relations: ['user'],
    });
    return shop;
  }
  async getShopById(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({ where: { id: id } });
    if (!shop) throw new NotFoundException();
    return shop;
  }
  async findMany(ids: string[]): Promise<Shop[]> {
    return await this.shopRepository.find({ where: { id: In(ids) } });
  }
  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({ where: { id: id } });
    if (!shop) throw new BadRequestException('Shop not found');
    return shop;
  }
}
