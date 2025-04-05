import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['shop'],
        protoPath: ['./src/proto/shop.proto'],
        url: '0.0.0.0:50050',
      },
    },
  );
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: 'auth_queue',
      queueOptions: { durable: false },
    },
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: 'notification_queue',
      queueOptions: { durable: false },
    },
  });
  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RMQ_URL],
  //     queue: 'notification_queue',
  //     queueOptions: { durable: false },
  //   },
  // });
  await app.startAllMicroservices();
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || 3001;

  await app.listen(port);
  await grpcApp.listen();
}

bootstrap();
