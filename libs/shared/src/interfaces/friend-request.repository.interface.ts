import { FriendRequestEntity } from '../entities/friend-request.entity';
import { IBaseRepository } from '../repositories/base/base.abstract.repository.interface';

export interface IFriendRequestRepository
  extends IBaseRepository<FriendRequestEntity> {}
