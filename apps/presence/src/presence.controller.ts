import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  IPresenceService,
  ISharedService,
  PRESENCE_SERVICE,
  SHARED_SERVICE,
} from '@app/shared';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CacheService } from '@app/shared/services/cache.service';

@Controller()
export class PresenceController {
  constructor(
    @Inject(PRESENCE_SERVICE)
    private readonly presenceService: IPresenceService,
    @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
    private readonly cacheService: CacheService,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  @UseInterceptors(CacheInterceptor)
  async getPresence(@Ctx() ctx: RmqContext) {
    const cache = await this.cacheService.get('foo');

    if (cache) {
      console.log('CACHE');
      return cache;
    }
    this.sharedService.ackMessage(ctx);

    const presence = this.presenceService.getHello();
    this.cacheService.set('foo', presence, 5000);
    return presence;
  }
}
