import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { CategoryModule } from '../category/category.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ShopModule } from '../shop/shop.module';
import { Shop, ShopSchema } from '../shop/schemas/shop.schema';
import { ProductRepository } from './repositories/product.repository';
import { ContextProduct } from './states/context.product.state';
import { InventoryService } from './services/inventory.service';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheProxy } from 'src/common/cache/cache';
import { RedisService } from 'src/databases/redis/redis.service';
import { ProductFilterBuilder } from './builder/product-filter.builder';
// import { FileValidationMiddleware } from 'src/common/middlewares/file.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
    RabbitMQModule,
    CloudinaryModule,
    CategoryModule,
    ShopModule,
    ClientsModule.register([
      {
        name: 'GRPC_AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50050',
          package: ['shop'],
          protoPath: ['src/proto/shop.proto'],
        },
      },
    ]),
  ],

  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    ContextProduct,
    InventoryService,
    CacheProxy,
    RedisService,
    ProductFilterBuilder,
  ],
  exports: [ProductService],
})
export class ProductModule {}
// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(FileValidationMiddleware).forRoutes('product/create');
//   }
// }
