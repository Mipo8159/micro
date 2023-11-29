import { UserEntity } from '@app/shared';
import { IBaseRepository } from '../repositories/base/base.abstract.repository.interface';

export interface IUserRepository extends IBaseRepository<UserEntity> {}
