import { FriendRequestEntity } from './../entities/friend-request.entity';
import { IFriendRequestRepository } from '../interfaces/friend-request.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendRequestRepository
  extends BaseAbstractRepository<FriendRequestEntity>
  implements IFriendRequestRepository
{
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {
    super(friendRequestRepository);
  }
}
