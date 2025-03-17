import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { CategoryModule } from '../category/category.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ShopModule } from '../shop/shop.module';
import { Shop, ShopSchema } from '../shop/schemas/shop.schema';
import { ProductRepository } from './repositories/product.repository';
import { ContextProduct } from './states/context.product.state';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),

    CloudinaryModule,
    CategoryModule,
    ShopModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ContextProduct],
  exports: [ProductService],
})
export class ProductModule {}
