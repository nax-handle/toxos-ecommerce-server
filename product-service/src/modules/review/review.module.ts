import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { ProductModule } from '../product/product.module';
import { Observer } from './observer/observer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailNotifier } from './observer/notifier/email.notifier';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ProductModule,
    RabbitMQModule,
    ClientsModule.register([
      {
        name: 'GRPC_ORDER_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: ['order'],
          protoPath: ['src/proto/order.proto'],
        },
      },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, Observer, EmailNotifier],
})
export class ReviewModule {}
