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
import { Public } from '@/auth/decorators/public.decorator';
import { OptionalJwtAuthGuard } from '@/auth/passports/optional-jwt-auth.guard';
import { AddNoteDto } from '@/notes/note.dto';

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
  @Get(':userName')
  async getProfile(@Req() req, @Param('userName') userName: string) {
    return await this.profileService.getProfile(req?.user?.userName, userName);
  }
}
