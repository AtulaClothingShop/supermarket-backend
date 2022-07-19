import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import LoggerMiddleware from './middlewares/logger.middleware';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/log/logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { AllExceptionsFilter } from './decorators/catchError';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from './modules/config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
  imports: [
    LoggerModule,
    ConfigModule,
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
