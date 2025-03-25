import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'RMQ_ORDER',
      useFactory: (configService: ConfigService) => {
        const rmqUrl = configService.get('RMQ_URL') as string;
        const queue = 'order_queue';
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
            queue: queue,
            queueOptions: { durable: false },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['RMQ_ORDER'],
})
export class RabbitMQModule {}
