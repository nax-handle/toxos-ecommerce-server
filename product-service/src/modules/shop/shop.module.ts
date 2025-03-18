import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
  ],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
