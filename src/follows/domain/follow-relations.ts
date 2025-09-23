import { Types } from 'mongoose';
import { Status } from '../follow.schema';

export class FollowRelation {
  constructor(
    public follower: Types.ObjectId,
    public following: Types.ObjectId,
    public status: Status = Status.ACCEPTED,
  ) {}

  static create(
    follower: Types.ObjectId,
    following: Types.ObjectId,
    isPrivate: boolean,
  ) {
    return new FollowRelation(
      follower,
      following,
      isPrivate ? Status.REQUESTED : Status.ACCEPTED,
    );
  }

  get isAccepted() {
    return this.status === Status.ACCEPTED;
  }

  get isRequested() {
    return this.status === Status.REQUESTED;
  }

  static isMutual(relationA?: FollowRelation, relationB?: FollowRelation) {
    return relationA?.isAccepted && relationB?.isAccepted;
  }
}
