import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './configs/decorators/catchError';
import CustomLogger from './modules/log/customLogger';
import getLogLevels from './utils/getLogLevels';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
    bufferLogs: true
  });
  app.useLogger(app.get(CustomLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );
  
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  
  await app.listen(process.env.PORT);
}
bootstrap();
