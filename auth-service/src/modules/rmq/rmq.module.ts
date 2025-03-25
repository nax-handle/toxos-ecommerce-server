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
            queue: 'auth',
            queueOptions: { durable: false },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['RMQ_AUTH'],
})
export class RabbitMQModule {}
