import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { GetMessageDto } from './message.dto';
import { GetMessagesRes } from './message.type';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':conversation_id')
  async getMessagesByConversationId(
    @Param('conversation_id') conversation_id: string,
    @Query() dto: GetMessageDto,
  ): Promise<GetMessagesRes> {
    console.log(conversation_id);

    return this.messageService.getMessagesByConversationId(
      conversation_id,
      dto,
    );
  }
}
