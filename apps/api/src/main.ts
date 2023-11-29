import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('API (Main)');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const API_PORT = config.get('API_PORT');
  await app.listen(API_PORT);
  logger.log(`Service RUnning on port: ${API_PORT}`);
}
bootstrap();
