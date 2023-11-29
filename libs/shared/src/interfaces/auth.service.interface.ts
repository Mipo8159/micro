import { LoginPayload } from 'apps/auth/src/payloads/login.payload';
import { RegisterPayload } from 'apps/auth/src/payloads/register.payload';
import { UserEntity } from '../entities/user.entity';
import { UserJwt } from './user.jwt.interface';
import { FriendRequestEntity } from '../entities/friend-request.entity';

export interface IAuthInterface {
  getUsers(): Promise<UserEntity[]>;
  login(payload: LoginPayload): Promise<{ jwt: string }>;
  register(payload: RegisterPayload): Promise<UserEntity>;
  verifyJwt(jwt: string): Promise<{ exp: string }>;
  validateUser(payload: LoginPayload): Promise<UserEntity>;
  isPasswordMatch(password: string, hash: string): Promise<boolean>;
  findByEmail(email: string): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  getUserFromHeader(jwt: string): Promise<UserJwt>;
  addFriend(userId: number, friendId: number): Promise<FriendRequestEntity>;
  getFriends(userId: number): Promise<FriendRequestEntity[]>;
  getFriendsList(userId: number): Promise<any>;
}
