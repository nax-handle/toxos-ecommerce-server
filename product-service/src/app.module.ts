import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { MongoDBModule } from './databases/mongodb';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { ShopModule } from './modules/shop/shop.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ReviewModule } from './modules/review/review.module';
import { ApiKeyMiddleware } from './common/middlewares/api-key.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ProductModule,
    MongoDBModule,
    CategoryModule,
    ShopModule,
    RabbitMQModule,
    ReviewModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
  }
}
