import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { GetMessageDto } from './message.dto';
import { GetMessagesRes } from './types/message';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':conversationId')
  async getMessagesByConversationId(
    @Req() req,
    @Param('conversationId') conversationId: string,
    @Query() dto: GetMessageDto,
  ): Promise<GetMessagesRes> {
    return this.messageService.getMessagesByConversationId(
      req.user.sub,
      conversationId,
      dto,
    );
  }
}
