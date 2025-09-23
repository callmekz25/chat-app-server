import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('users')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Get(':user_name/followers')
  async getFollowers(@Param('user_name') user_name: string) {
    return this.followService.getFollowers(user_name);
  }

  @Get(':user_name/followings')
  async getFollowings(@Param('user_name') user_name: string) {
    return this.followService.getFollowings(user_name);
  }

  @Post(':user_name/follow')
  async followingUser(@Req() req, @Param('user_name') user_name: string) {
    return this.followService.followUser(req.user.user_name, user_name);
  }

  @Post(':user_name/unfollow')
  async unfollowingUser(@Req() req, @Param('user_name') user_name: string) {
    return this.followService.unfollowUser(req.user.user_name, user_name);
  }
}
