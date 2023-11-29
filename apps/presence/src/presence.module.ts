import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from '../../../libs/shared/src/services/presence.service';
import {
  AUTH_SERVICE,
  PRESENCE_SERVICE,
  RedisModule,
  SHARED_SERVICE,
  SharedModule,
  SharedService,
} from '@app/shared';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SharedModule.RegisterRmq(AUTH_SERVICE, process.env.RABBITMQ_AUTH_QUEUE),
    RedisModule,
  ],
  controllers: [PresenceController],
  providers: [
    {
      provide: PRESENCE_SERVICE,
      useClass: PresenceService,
    },
    {
      provide: SHARED_SERVICE,
      useClass: SharedService,
    },
  ],
})
export class PresenceModule {}
