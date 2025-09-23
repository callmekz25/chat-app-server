import { Model, Types } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Follow, FollowDocument } from './follow.schema';
import { FollowRelation } from './domain/follow-relations';

export class FollowRepository {
  constructor(@InjectModel(Follow.name) private model: Model<FollowDocument>) {}

  async createRelation(relation: FollowRelation) {
    return await this.model.create(relation);
  }

  async findBothRelations(
    viewer_id: Types.ObjectId,
    target_id: Types.ObjectId,
  ) {
    const [relationVT, relationTV] = await Promise.all([
      this.findRelation(viewer_id, target_id),
      this.findRelation(target_id, viewer_id),
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
    follower_user_id: Types.ObjectId,
    following_user_id: Types.ObjectId,
  ) {
    const relation = await this.findRelation(
      follower_user_id,
      following_user_id,
    );
    await this.model.create(relation);
    return relation;
  }

  async unfollowUser(
    follower_user_id: Types.ObjectId,
    following_user_id: Types.ObjectId,
  ) {
    await this.model.deleteOne({
      follower: new Types.ObjectId(follower_user_id),
      following: new Types.ObjectId(following_user_id),
    });
  }

  async getFollowers(user_id: Types.ObjectId) {
    return await this.model
      .find({
        following: new Types.ObjectId(user_id),
      })
      .select('follower status')
      .populate({
        path: 'follower',
        select: 'user_name avatar_url full_name',
      });
  }

  async getFollowings(user_id: Types.ObjectId) {
    return await this.model
      .find({
        follower: new Types.ObjectId(user_id),
      })
      .select('following status')
      .populate({
        path: 'following',
        select: 'user_name avatar_url full_name',
      });
  }
}
