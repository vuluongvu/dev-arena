import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật validate pipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại field không khai báo trong DTO
      forbidNonWhitelisted: true, // field lạ -> tra về 400
      transform: true, // tự convert type (string -> number...)
    }),
  );

  // set global prefix api/v1/...
  app.setGlobalPrefix('api/v1');

  // enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
