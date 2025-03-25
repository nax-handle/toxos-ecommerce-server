import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'RMQ_AUTH',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RMQ_URL')],
            queue: 'auth_queue',
            //configService.get('RMQ_QUEUE'),
            queueOptions: { durable: false },
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'RMQ_PRODUCT',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RMQ_URL')],
            queue: 'product_queue',
            //configService.get('RMQ_QUEUE'),
            queueOptions: { durable: false },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['RMQ_AUTH', 'RMQ_PRODUCT'],
})
export class RabbitMQModule {}
