import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable global validate pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove not allowed fields
      forbidNonWhitelisted: true, // wrong filed -> return 400
      transform: true, // convert type (string -> number...)
    }),
  );

  // set global prefix api/v1/...
  app.setGlobalPrefix('api/v1');

  // enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // use helmet for security headers
  app.use(helmet());

  // enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // use global interceptor for class serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // setup swagger documentation at /api/docs
  const config = new DocumentBuilder()
    .setTitle('My Backend API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // start the application
  await app.listen(process.env.PORT ?? 3000);
}
// start the application
await bootstrap();
