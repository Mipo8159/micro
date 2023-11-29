import { Injectable } from '@nestjs/common';
import { IPresenceService } from '../interfaces/presence.service.interface';

@Injectable()
export class PresenceService implements IPresenceService {
  getHello(): string {
    console.log('NOT A CACHE');
    return 'Hello World!';
  }
}
