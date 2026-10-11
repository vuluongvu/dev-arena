import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from './common/exception-filters/all-exceptions-filter.filter.js';
import { RequestMiddleware } from './common/middleware/request-id.middleware.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      // Validation schema for environment variables
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().port().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().allow('').required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().min(32).required(),
      }),
    }),

    // ThrottlerModule for rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 3, // 10 requests per minute
      },
    ]),

    //

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // only for development, set to false in production
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // 1. Run first: Rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    // 2. Run second: JWT authentication guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // 3. Run third: Roles guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    // 4. Transform format response
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    // 5. Logging interceptor: response / request
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    // 6. Global exception filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  // enable middleware for request-id generation
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*'); // apply to all routes
  }
}
