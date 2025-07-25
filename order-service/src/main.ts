import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue: 'order_queue',
      queueOptions: { durable: false },
    },
  });
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['order'],
        protoPath: ['./src/proto/order.proto'],
        url: '0.0.0.0:50051',
      },
    },
  );
  await grpcApp.listen();
  await app.startAllMicroservices();
  const PORT = process.env.PORT || 9001;
  await app.listen(PORT);
  console.log(`Application running on port ${PORT}`);
}
bootstrap();
