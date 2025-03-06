import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MensFashionFactory } from './factories/mens-fashtion/mens-fashion.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { CategoryModule } from '../category/category.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CloudinaryModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, MensFashionFactory],
})
export class ProductModule {}
