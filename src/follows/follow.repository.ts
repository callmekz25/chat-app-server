import { Model, Types } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Follow, FollowDocument, Status } from './follow.schema';
import { FollowRelation } from './domain/follow-relations';

export class FollowRepository {
  constructor(@InjectModel(Follow.name) private model: Model<FollowDocument>) {}

  async createRelation(relation: FollowRelation) {
    return await this.model.create({
      follower: relation.follower,
      following: relation.following,
      status: relation.status,
    });
  }

  async findBothRelations(viewerIdd: Types.ObjectId, targetId: Types.ObjectId) {
    const [relationVT, relationTV] = await Promise.all([
      this.findRelation(viewerIdd, targetId),
      this.findRelation(targetId, viewerIdd),
    ]);
    return [relationVT, relationTV];
  }

  async findRelation(follower: Types.ObjectId, following: Types.ObjectId) {
    const doc = await this.model
      .findOne({ follower, following, deletedAt: null }, { status: 1 })
      .lean();
    return doc
      ? new FollowRelation(doc.follower, doc.following, doc.status)
      : undefined;
  }

  async followUser(
    followerUserId: Types.ObjectId,
    followingUserId: Types.ObjectId,
  ) {
    const relation = await this.findRelation(followerUserId, followingUserId);

    if (!relation) {
      const newRelation = new FollowRelation(
        followerUserId,
        followingUserId,
        Status.ACCEPTED,
      );
      return await this.createRelation(newRelation);
    }

    return relation;
  }

  async unfollowUser(
    followerUserId: Types.ObjectId,
    followingUserId: Types.ObjectId,
  ) {
    await this.model.deleteOne({
      follower: new Types.ObjectId(followerUserId),
      following: new Types.ObjectId(followingUserId),
    });
  }

  async getFollowers(userId: Types.ObjectId) {
    return await this.model
      .find({
        following: new Types.ObjectId(userId),
      })
      .select('follower status')
      .populate({
        path: 'follower',
        select: 'userName avatar fullName',
      });
  }

  async getFollowings(userId: Types.ObjectId) {
    return await this.model
      .find({
        follower: new Types.ObjectId(userId),
      })
      .select('following status')
      .populate({
        path: 'following',
        select: 'userName avatar fullName',
      });
  }
}
