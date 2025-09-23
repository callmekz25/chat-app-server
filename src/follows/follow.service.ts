import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/users/user.service';
import { FollowRelation } from './domain/follow-relations';
import { FollowRepository } from './follow.repository';

@Injectable()
export class FollowService {
  constructor(
    private readonly repository: FollowRepository,
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
    const [relationVT, relationTV] = await this.repository.findBothRelations(
      viewer._id,
      target._id,
    );

    return {
      isMe: false,
      isFollowing: relationVT?.isAccepted ?? false,
      isRequested: relationVT?.isRequested ?? false,
      isFollowedBy: relationTV?.isAccepted ?? false,
      isMutual: FollowRelation.isMutual(relationVT, relationTV),
    };
  }

  async getFollowers(user_name: string) {
    const user = await this.userService.getByUserName(user_name);
    if (!user) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    const followers = await this.repository.getFollowers(user._id);
    return {
      followers,
    };
  }

  async getFollowings(user_name: string) {
    const user = await this.userService.getByUserName(user_name);
    if (!user) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    const followings = await this.repository.getFollowings(user._id);
    return {
      followings,
    };
  }

  async unfollowUser(follower_user_name: string, following_user_name: string) {
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

    await this.repository.unfollowUser(user._id, otherUser._id);
    await Promise.all([
      this.userService.updateFollower(user._id.toString(), 'following', -1),
      this.userService.updateFollower(otherUser._id.toString(), 'follower', -1),
    ]);
    return true;
  }

  async followUser(follower_name: string, following_name: string) {
    if (!follower_name) {
      throw new UnauthorizedException();
    }
    if (!follower_name) {
      throw new BadRequestException();
    }
    if (follower_name === following_name) {
      throw new ConflictException();
    }
    const [user, otherUser] = await Promise.all([
      this.userService.getByUserName(follower_name),
      this.userService.getByUserName(following_name),
    ]);

    if (!user || !otherUser) {
      throw new NotFoundException();
    }

    const relation = await this.repository.followUser(user._id, otherUser._id);
    if (relation && relation.isAccepted) {
      await Promise.all([
        this.userService.updateFollower(user._id.toString(), 'following', 1),
        this.userService.updateFollower(
          otherUser._id.toString(),
          'follower',
          1,
        ),
      ]);
    }
    return true;
  }
}
