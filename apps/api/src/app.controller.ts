import {
  AUTH_CLIENT,
  AuthGuard,
  IUserRequest,
  PRESENCE_CLIENT,
} from '@app/shared';
import { UserInterceptor } from '@app/shared/interceptors/user.interceptor';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginPayload } from 'apps/auth/src/payloads/login.payload';

@Controller()
export class AppController {
  constructor(
    @Inject(AUTH_CLIENT) private readonly authClient: ClientProxy,
    @Inject(PRESENCE_CLIENT) private readonly presencelient: ClientProxy,
  ) {}

  @Get('users')
  async getUsers() {
    return this.authClient.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }

  @Post('auth/login')
  async login(@Body() payload: LoginPayload) {
    return this.authClient.send(
      {
        cmd: 'login',
      },
      { ...payload },
    );
  }

  @Post('auth/register')
  async register(@Body() { firstName, lastName, email, password }: any) {
    return this.authClient.send(
      {
        cmd: 'register',
      },
      { firstName, lastName, email, password },
    );
  }

  @UseGuards(AuthGuard)
  @Get('presence')
  async getPresence() {
    return this.presencelient.send(
      {
        cmd: 'get-presence',
      },
      {},
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Post('add-friend/:friendId')
  async addFriend(
    @Param('friendId') friendId: number,
    @Req() req: IUserRequest,
  ) {
    if (!req.user) {
      throw new BadRequestException();
    }

    return this.authClient.send(
      {
        cmd: 'add-friend',
      },
      {
        userId: req.user.id,
        friendId,
      },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-friends')
  async getFriends(@Req() req: IUserRequest) {
    if (!req?.user) {
      throw new BadRequestException();
    }

    return this.authClient.send(
      {
        cmd: 'get-friends',
      },
      {
        userId: req.user.id,
      },
    );
  }
}
