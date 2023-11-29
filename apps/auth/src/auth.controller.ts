import { Controller, Inject, UseGuards } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  IAuthInterface,
  ISharedService,
  SHARED_SERVICE,
} from '@app/shared';
import { RegisterPayload } from './payloads/register.payload';
import { JwtGuard } from '../../api/src/jwt.guard';

@Controller()
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthInterface,
    @Inject(SHARED_SERVICE) private readonly sharedService: ISharedService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(@Ctx() ctx: RmqContext) {
    this.sharedService.ackMessage(ctx);
    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() payload: RegisterPayload, @Ctx() ctx: RmqContext) {
    this.sharedService.ackMessage(ctx);
    return this.authService.login(payload);
  }

  @MessagePattern({ cmd: 'register' })
  register(@Payload() payload: RegisterPayload, @Ctx() ctx: RmqContext) {
    this.sharedService.ackMessage(ctx);
    return this.authService.register(payload);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  verifyJwt(@Payload() payload: { jwt: string }, @Ctx() ctx: RmqContext) {
    this.sharedService.ackMessage(ctx);
    return this.authService.verifyJwt(payload.jwt);
  }

  @MessagePattern({ cmd: 'decode-jwt' })
  async decodeJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.sharedService.ackMessage(context);
    return this.authService.getUserFromHeader(payload.jwt);
  }

  @MessagePattern({ cmd: 'add-friend' })
  async addFriend(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number; friendId: number },
  ) {
    this.sharedService.ackMessage(context);

    return this.authService.addFriend(payload.userId, payload.friendId);
  }

  @MessagePattern({ cmd: 'get-friends' })
  async getFriends(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    this.sharedService.ackMessage(context);

    return this.authService.getFriends(payload.userId);
  }

  @MessagePattern({ cmd: 'get-friends-list' })
  async getFriendsList(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    this.sharedService.ackMessage(context);

    return this.authService.getFriendsList(payload.userId);
  }
}
