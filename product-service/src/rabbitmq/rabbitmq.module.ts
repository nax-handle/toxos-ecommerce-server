import { Module, Logger } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'RMQ_SERVICE',
      useFactory: (configService: ConfigService) => {
        const rmqUrl = configService.get('RMQ_URL') as string;
        const queue = configService.get('RMQ_QUEUE') as string;
        Logger.log(
          `Connecting to RabbitMQ at ${rmqUrl}, queue: ${queue}`,
          'RabbitMQModule',
        );
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
  exports: ['RMQ_SERVICE'],
})
export class RabbitMQModule {}
