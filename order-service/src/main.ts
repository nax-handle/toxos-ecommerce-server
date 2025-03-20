import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  // app.enableCors({
  //   origin: ['http://localhost:3004', 'http://localhost'],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice([]);
  // app.use('/order/webhook/stripe', express.raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import * as express from 'express';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe());
//   app.use('/order/webhook/stripe', express.raw({ type: 'application/json' }));
//   await app.listen(process.env.PORT ?? 3002);
// }
// bootstrap();
