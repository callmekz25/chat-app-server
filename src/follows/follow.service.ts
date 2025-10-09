import {
  BadRequestException,
  ConflictException,
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

  async getRelations(viewerName: string, targetName: string) {
    if (viewerName === targetName) {
      return {
        isMe: true,
        isFollowing: false,
        isRequested: false,
        isFollowedBy: false,
        isMutual: false,
      };
    }
    const [viewer, target] = await Promise.all([
      this.userService.getByUserName(viewerName),
      this.userService.getByUserName(targetName),
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

  async getFollowers(userName: string) {
    const user = await this.userService.getByUserName(userName);
    if (!user) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    const followers = await this.repository.getFollowers(user._id);
    return {
      followers,
    };
  }

  async getFollowings(userName: string) {
    const user = await this.userService.getByUserName(userName);
    if (!user) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    const followings = await this.repository.getFollowings(user._id);
    return {
      followings,
    };
  }

  async unfollowUser(followerUserName: string, followingUserName: string) {
    if (!followerUserName) {
      throw new UnauthorizedException();
    }
    if (!followingUserName) {
      throw new BadRequestException();
    }

    if (followerUserName === followingUserName) {
      throw new ConflictException();
    }
    const user = await this.userService.getByUserName(followerUserName);
    const otherUser = await this.userService.getByUserName(followingUserName);
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

  async followUser(followerUserName: string, followingUserName: string) {
    if (!followerUserName) {
      throw new UnauthorizedException();
    }
    if (!followingUserName) {
      throw new BadRequestException();
    }
    if (followerUserName === followingUserName) {
      throw new ConflictException();
    }
    const [user, otherUser] = await Promise.all([
      this.userService.getByUserName(followerUserName),
      this.userService.getByUserName(followingUserName),
    ]);

    if (!user || !otherUser) {
      throw new NotFoundException();
    }

    const relation = await this.repository.followUser(user._id, otherUser._id);

    if (relation && (relation as FollowRelation).isAccepted) {
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
