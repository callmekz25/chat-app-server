import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly converService: ConversationService) {}

  @Post()
  async getOrCreateConversation(
    @Req() req,
    @Body() body: CreateConversationDto,
  ) {
    return this.converService.getOrCreateConversation(
      req.user.sub,
      body.other_user_id,
    );
  }

  @Get()
  async getConversations(@Req() req) {
    return this.converService.getConversations(req.user.sub);
  }

  @Get(':id')
  async getConversationById(@Req() req, @Param('id') id: string) {
    return this.converService.getConversationById(id);
  }
}
