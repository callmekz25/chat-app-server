import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly converService: ConversationService) {}

  @Get()
  async getConversations(@Req() req) {
    return this.converService.getConversations(req.user.sub);
  }

  @Post()
  async createConversation(@Req() req, @Body() body: CreateConversationDto) {
    await this.converService.createConversation(req.user.sub, body);
  }
}
