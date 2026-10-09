import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';

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
  // Đăng ký LoggingInterceptor toàn cục
  app.useGlobalInterceptors(new LoggingInterceptor());

  // set global prefix api/v1/...
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
