import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterShopDto } from './dto/register-shop.dto';
import { Shop, ShopDocument } from './schemas/shop.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getSlug } from 'src/utils/slugify';
import { ObjectId } from 'src/utils/object-id';

@Injectable()
export class ShopService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>) {}

  async registerShop(registerShopDto: RegisterShopDto): Promise<Shop> {
    const { userId, name } = registerShopDto;
    const exists = await this.existsShop(userId, getSlug(name));
    if (exists) {
      throw new BadRequestException('Shop already exists');
    }
    const data = await this.shopModel.create(registerShopDto);
    return data;
  }
  async getOwnShop(userId: string): Promise<Shop> {
    const shop = await this.shopModel.findOne({ userId });
    if (!shop) throw new UnauthorizedException();
    return shop;
  }
  async existsShop(userId: string, slug: string): Promise<boolean> {
    const shop = await this.shopModel.exists({
      $or: [{ user: userId }, { slug }],
    });
    return !!shop;
  }
  async getShopBySlug(slug: string): Promise<Shop> {
    const shop = await this.shopModel.findOne({ slug });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }
  async findMany(_ids: string[]): Promise<Shop[]> {
    const objectIds = _ids.map((value) => ObjectId(value));
    const shops = await this.shopModel.find({ _id: { $in: objectIds } });
    return shops;
  }
  // async getShop(user: User): Promise<Shop> {}
}
