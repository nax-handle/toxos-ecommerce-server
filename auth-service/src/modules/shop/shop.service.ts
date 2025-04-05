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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async registerShop(registerShopDto: RegisterShopDto): Promise<Shop> {
    const { file } = registerShopDto;
    const url = await this.cloudinaryService.uploadFile(file);
    const data = this.shopRepository.create({ ...registerShopDto, logo: url });
    return await this.shopRepository.save(data);
  }
  async getShop(user: User): Promise<Shop | null> {
    console.log(user);
    const shop = await this.shopRepository.findOne({
      where: { userId: user.id },
      relations: ['user'],
    });
    console.log(shop);
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
  async findEmailShop(shopId: string): Promise<string> {
    const shop = await this.shopRepository.findOne({
      where: { id: shopId },
      relations: ['user'],
    });
    if (!shop) throw new BadRequestException('Shop not found');
    return shop.user.email;
  }
}
