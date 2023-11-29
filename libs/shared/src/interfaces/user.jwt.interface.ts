import { IUserRequest } from './user.request.interface';

export interface UserJwt extends IUserRequest {
  iat: number;
  exp: number;
}
