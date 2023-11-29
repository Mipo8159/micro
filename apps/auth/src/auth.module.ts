import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import {
  AUTH_SERVICE,
  AuthService,
  FRIEND_REQUEST_REPOSITORY,
  FriendRequestEntity,
  JwtGuard,
  SHARED_SERVICE,
  SharedModule,
  SharedService,
  USER_REPOSITORY,
  UserEntity,
  UserRepository,
} from '@app/shared';
import { DatabaseModule } from '@app/shared';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.stragety';
import { FriendRequestRepository } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity, FriendRequestEntity]),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtGuard,
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: SHARED_SERVICE,
      useClass: SharedService,
    },
    {
      provide: FRIEND_REQUEST_REPOSITORY,
      useClass: FriendRequestRepository,
    },
  ],
})
export class AuthModule {}
