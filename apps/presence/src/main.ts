import { NestFactory } from '@nestjs/core';
import { PresenceModule } from './presence.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);
  const config = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const RMQ_PRESENCE_QUEUE = config.get<string>('RABBITMQ_PRESENCE_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(RMQ_PRESENCE_QUEUE));
  await app.startAllMicroservices();
}
bootstrap();
