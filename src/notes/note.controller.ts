import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { NoteService } from './note.service';
import { JwtAuthGuard } from '@/auth/passports/jwt-auth.guard';
import { AddNoteDto } from '@/users/dtos/add-note-dto';

@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNote(@Req() req) {
    return await this.noteService.getByUserId(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteNote(@Req() req) {
    return await this.noteService.deleteNote(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addNote(@Req() req, @Body() body: AddNoteDto) {
    return await this.noteService.addNote(req.user.sub, body.content);
  }
}
