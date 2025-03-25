import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT ?? 3003);
  // Microservice gRPC
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['product'],
        protoPath: ['./src/proto/product.proto'],
        url: '0.0.0.0:50052',
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());

  await grpcApp.listen();

  // Microservice RabbitMQ
  const rmqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL || ''],
        queue: 'product_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await rmqApp.listen();
  await app.startAllMicroservices();
}
bootstrap();
