import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MicroserviceOptions,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { ISharedService } from '../interfaces/shared.service.interface';

@Injectable()
export class SharedService implements ISharedService {
  constructor(private readonly config: ConfigService) {}
  getRmqOptions(queue: string): MicroserviceOptions {
    const RMQ_USER = this.config.get('RABBITMQ_DEFAULT_USER');
    const RMQ_PASS = this.config.get('RABBITMQ_DEFAULT_PASS');
    const RMQ_HOST = this.config.get('RABBITMQ_HOST');
    const RMQ_PORT = this.config.get<string>('RABBITMQ_PORT');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RMQ_USER}:${RMQ_PASS}@${RMQ_HOST}:${RMQ_PORT}`],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
  ackMessage(ctx: RmqContext): void {
    const channel = ctx.getChannelRef();
    const message = ctx.getMessage();
    channel.ack(message);
  }
}
