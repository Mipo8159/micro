import { DynamicModule, Module } from '@nestjs/common';
import { SharedService } from '../services/shared.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static RegisterRmq(service: string | symbol, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (config: ConfigService) => {
          const RMQ_USER = config.get<string>('RABBITMQ_DEFAULT_USER');
          const RMQ_PASS = config.get<string>('RABBITMQ_DEFAULT_PASS');
          const RMQ_HOST = config.get<string>('RABBITMQ_HOST');
          const RMQ_PORT = config.get<string>('RABBITMQ_PORT');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${RMQ_USER}:${RMQ_PASS}@${RMQ_HOST}:${RMQ_PORT}`],
              queue,
              queueOptions: {
                durable: true, // queue survives broker restart
              },
            },
          });
        },
        inject: [ConfigService],
      },
    ];

    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }
}
