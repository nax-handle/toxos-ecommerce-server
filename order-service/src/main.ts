import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: process.env.RMQ_QUEUE,
      queueOptions: { durable: false },
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });
  const PORT = process.env.PORT || 9001;
  await app.startAllMicroservices();
  await app.listen(PORT);
  console.log(`Application running on port ${PORT}`);
}
bootstrap();
