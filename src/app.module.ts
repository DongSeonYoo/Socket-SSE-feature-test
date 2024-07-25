import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UnhandledExceptionFilter } from './filters/unhandled-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { SuccessResponseInterceptor } from './interceptors/response.interceptor';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UsersModule } from './apis/users/users.module';
import { PostsModule } from './apis/posts/posts.module';
import { NotificationsModule } from './apis/notifications/notifications.module';
import { CommentsModule } from './apis/comments/comments.module';
import { AuthModule } from './apis/auth/auth.module';
import { RepliesModule } from './apis/replies/replies.module';
import Joi from 'joi';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseModule } from './apis/sse/sse.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MODE: Joi.string().valid('development', 'prod', 'test').required(),
        PORT: Joi.number().port().default(3000),
        JWT_SECRET_KEY: Joi.string().required(),
        JWT_EXPIRED_TIME: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'), // 'html' 폴더 없애고
      serveRoot: '/',
      serveStaticOptions: {
        extensions: ['html'],
      },
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    UsersModule,
    PostsModule,
    NotificationsModule,
    CommentsModule,
    AuthModule,
    RepliesModule,
    SseModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerMiddleware,
    Logger,
    {
      provide: APP_FILTER,
      useClass: UnhandledExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
        }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
