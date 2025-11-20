import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { getEnvArray } from './common/utils/env.util';
import { ICorsConfig } from './config/interfaces/cors-config.interface';
import { CustomLoggerService } from './shared/services/custom-logger.service';
import { validationPipeOptions } from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const configService = app.get(ConfigService);

  const corsConfig = configService.get<ICorsConfig>('cors');

  app.enableCors(corsConfig);

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  await app.listen(getEnvArray('PORT', ['3000'])[0]);
}
bootstrap();
