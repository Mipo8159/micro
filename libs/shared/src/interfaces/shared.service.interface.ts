import { MicroserviceOptions, RmqContext } from '@nestjs/microservices';

export interface ISharedService {
  getRmqOptions(queue: string): MicroserviceOptions;
  ackMessage(ctx: RmqContext): void;
}
