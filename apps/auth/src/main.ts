import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const config = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const RMQ_AUTH_QUEUE = config.get<string>('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(RMQ_AUTH_QUEUE));
  await app.startAllMicroservices();
}
bootstrap();
