import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { RegisterPayload } from '../../../../apps/auth/src/payloads/register.payload';
import * as bcryptjs from 'bcryptjs';
import { LoginPayload } from '../../../../apps/auth/src/payloads/login.payload';
import { JwtService } from '@nestjs/jwt';
import { IAuthInterface } from '../interfaces/auth.service.interface';
import {
  FRIEND_REQUEST_REPOSITORY,
  USER_REPOSITORY,
} from '../constants/repositories';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { UserJwt } from '../interfaces/user.jwt.interface';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { IFriendRequestRepository } from '../interfaces/friend-request.repository.interface';

@Injectable()
export class AuthService implements IAuthInterface {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(FRIEND_REQUEST_REPOSITORY)
    private readonly friendRequestRepository: IFriendRequestRepository,
    private readonly jwtService: JwtService,
  ) {}

  getUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async login(payload: LoginPayload) {
    const { email, password } = payload;

    const user = await this.validateUser({ email, password });
    if (!user) throw new UnauthorizedException();

    const jwt = await this.jwtService.signAsync({ user });
    return { jwt };
  }

  async register(payload: RegisterPayload): Promise<UserEntity> {
    const { email, firstName, lastName, password } = payload;

    const exists = await this.findByEmail(email);

    if (exists) {
      throw new ConflictException('email is taken');
    }
    const hashPasword = await this.hashPassword(password);

    const user = await this.userRepository.save({
      email,
      firstName,
      lastName,
      password: hashPasword,
    });
    delete user.password;
    return user;
  }

  async verifyJwt(jwt: string) {
    if (!jwt) throw new UnauthorizedException();
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) return;

    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async validateUser(payload: LoginPayload): Promise<UserEntity> {
    const { email, password } = payload;
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isMatch = await this.isPasswordMatch(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async isPasswordMatch(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'email', 'lastName', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcryptjs.hash(password, 10);
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneById(id);
  }

  // FRIENDS
  async addFriend(
    userId: number,
    friendId: number,
  ): Promise<FriendRequestEntity> {
    const creator = await this.findById(userId);
    const receiver = await this.findById(friendId);

    return await this.friendRequestRepository.save({ creator, receiver });
  }

  async getFriends(userId: number): Promise<FriendRequestEntity[]> {
    const creator = await this.findById(userId);

    return await this.friendRequestRepository.findWithRelations({
      where: [{ creator }, { receiver: creator }],
      relations: ['creator', 'receiver'],
    });
  }

  async getFriendsList(userId: number) {
    const friendRequests = await this.getFriends(userId);

    if (!friendRequests) return [];

    const friends = friendRequests.map((friendRequest) => {
      const isUserCreator = userId === friendRequest.creator.id;
      const friendDetails = isUserCreator
        ? friendRequest.receiver
        : friendRequest.creator;

      const { id, firstName, lastName, email } = friendDetails;

      return {
        id,
        email,
        firstName,
        lastName,
      };
    });

    return friends;
  }
}
