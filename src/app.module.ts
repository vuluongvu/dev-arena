import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from './common/exception-filters/all-exceptions-filter.filter.js';
import { RequestMiddleware } from './common/middleware/request-id.middleware.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ThrottlerModule for rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 3, // 10 requests per minute
      },
    ]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
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

    // Global JwtGuard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Global role-based guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    // Global transform interceptor to format API responses
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    // Global logging interceptor to log requests and responses
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    // Hide logging interceptor from global scope, as it may expose sensitive information in production
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // Global ThrottlerGuard for rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  // enable middleware for request-id generation
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*'); // apply to all routes
  }
}
