import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import LoggerMiddleware from './middlewares/logger.middleware';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/log/logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { AllExceptionsFilter } from './decorators/catchError';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from './modules/config/config.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    LoggerModule,
    ConfigModule,
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     // JWT
    //     JWT_SECRET: Joi.string().required(),
    //     JWT_EXPIRATION_TIME: Joi.string().required(),
    //     JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    //     JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    //   }),
    // }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductModule,
    RouterModule.register([
      {
        path: 'v1',
        children: [
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'user',
            module: UsersModule,
          },
          {
            path: 'product',
            module: ProductModule,
          },
        ],
      },
    ]),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
