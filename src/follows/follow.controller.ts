import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('users')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Get(':userName/followers')
  async getFollowers(@Param('userName') userName: string) {
    return this.followService.getFollowers(userName);
  }

  @Get(':userName/followings')
  async getFollowings(@Param('userName') userName: string) {
    return this.followService.getFollowings(userName);
  }

  @Post(':userName/follow')
  async followingUser(@Req() req, @Param('userName') userName: string) {
    return this.followService.followUser(req.user.userName, userName);
  }

  @Post(':userName/unfollow')
  async unfollowingUser(@Req() req, @Param('userName') userName: string) {
    return this.followService.unfollowUser(req.user.userName, userName);
  }
}
