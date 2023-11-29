import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
('@nestjs/microservices');
import { AUTH_CLIENT, PRESENCE_CLIENT, SharedModule } from '@app/shared';

@Module({
  imports: [
    SharedModule.RegisterRmq(AUTH_CLIENT, process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.RegisterRmq(
      PRESENCE_CLIENT,
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
  ],
  controllers: [AppController],
})
export class AppModule {}
