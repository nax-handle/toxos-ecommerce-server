import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'RMQ_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RMQ_URL')],
            queue: configService.get('RMQ_QUEUE'),
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
