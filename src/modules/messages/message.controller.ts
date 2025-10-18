import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { GetMessagesRes } from './types/message';
import { GetMessageDto } from './dtos/getMessagesDto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':conversationId')
  async getMessagesByConversationId(
    @Param('conversationId') conversationId: string,
    @Query() dto: GetMessageDto,
  ): Promise<GetMessagesRes> {
    return this.messageService.getMessagesByConversationId(conversationId, dto);
  }
}
