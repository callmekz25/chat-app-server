import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':conversation_id')
  async getMessagesByConversationId(
    @Param('conversation_id') conversation_id: string,
  ) {
    console.log(conversation_id);

    return this.messageService.getMessagesByConversationId(conversation_id);
  }
}
