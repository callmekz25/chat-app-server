import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follow, FollowDocument, Status } from './follow.schema';
import { Model, Types } from 'mongoose';
import { UserService } from '@/users/user.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
    private readonly userService: UserService,
  ) {}

  async getRelations(viewer_name: string, target_name: string) {
    if (viewer_name === target_name) {
      return {
        isMe: true,
        isFollowing: false,
        isRequested: false,
        isFollowedBy: false,
        isMutual: false,
      };
    }
    const [viewer, target] = await Promise.all([
      this.userService.getByUserName(viewer_name),
      this.userService.getByUserName(target_name),
    ]);
    if (!viewer || !target) {
      return null;
    }

    const [edgeVT, edgeTV] = await Promise.all([
      this.followModel
        .findOne(
          {
            follower: viewer?._id,
            following: target?._id,
            deletedAt: null,
          },
          { status: 1 },
        )
        .lean(),
      this.followModel
        .findOne(
          { follower: target?._id, following: viewer?._id },
          { status: 1 },
        )
        .lean(),
    ]);

    const isFollowing = edgeVT?.status === Status.ACCEPTED;
    const isRequested = edgeVT?.status === Status.REQUESTED;
    const isFollowedBy = edgeTV?.status === Status.ACCEPTED;
    const isMutual = isFollowing && isFollowedBy;

    return { isMe: false, isFollowing, isRequested, isFollowedBy, isMutual };
  }

  async getFollowers(user_name: string) {
    const user = await this.userService.getByUserName(user_name);
    if (!user) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    const followers = await this.followModel
      .find({
        following: new Types.ObjectId(user._id),
      })
      .select('follower status')
      .populate({
        path: 'follower',
        select: 'user_name avatar_url full_name',
      });
    return {
      followers,
    };
  }

  async getFollowings(user_name: string) {
    const user = await this.userService.getByUserName(user_name);
    if (!user) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    const followings = await this.followModel
      .find({
        follower: new Types.ObjectId(user._id),
      })
      .select('following status')
      .populate({
        path: 'following',
        select: 'user_name avatar_url full_name',
      });
    return {
      followings,
    };
  }

  async followUser(follower_user_name: string, following_user_name: string) {
    if (!follower_user_name) {
      throw new UnauthorizedException();
    }
    if (!following_user_name) {
      throw new BadRequestException();
    }
    if (follower_user_name === following_user_name) {
      throw new ConflictException();
    }
    const user = await this.userService.getByUserName(follower_user_name);
    const otherUser = await this.userService.getByUserName(following_user_name);

    if (!user || !otherUser) {
      throw new NotFoundException();
    }

    if (user?.isPrivate) {
      await this.followModel.create({
        follower: new Types.ObjectId(user._id),
        following: new Types.ObjectId(otherUser._id),
        status: Status.REQUESTED,
      });
    } else {
      await this.followModel.create({
        follower: new Types.ObjectId(user._id),
        following: new Types.ObjectId(otherUser._id),
      });
      await this.userService.updateFollower(user._id.toString(), 'following');
      await this.userService.updateFollower(
        otherUser._id.toString(),
        'follower',
      );
    }
    return true;
  }
}
