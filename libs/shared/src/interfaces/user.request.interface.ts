import { Request } from 'express';
import { UserEntity } from '../entities/user.entity';

export interface IUserRequest extends Request {
  user?: UserEntity;
}
