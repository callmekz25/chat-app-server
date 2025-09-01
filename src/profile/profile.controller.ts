import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '@/auth/passports/jwt-auth.guard';
import { AddNoteDto } from '@/users/dtos/add-note-dto';
import { Public } from '@/auth/decorators/public.decorator';
import { OptionalJwtAuthGuard } from '@/auth/passports/optional-jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Delete('note')
  async deleteNote(@Req() req) {
    return await this.profileService.deleteNote(req.user.sub);
  }

  @Post('note')
  async addNote(@Req() req, @Body() body: AddNoteDto) {
    return await this.profileService.addNote(req.user.sub, body.content);
  }

  @Get('me')
  async getMe(@Req() req) {
    return this.profileService.getMe(req.user.sub);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':user_name')
  async getProfile(@Req() req, @Param('user_name') user_name: string) {
    return await this.profileService.getProfile(
      req?.user?.user_name,
      user_name,
    );
  }
}
