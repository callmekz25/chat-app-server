import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConversationModule } from '@/modules/conversations/conversation.module';
import { MessageModule } from '@/modules/messages/message.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [ConversationModule, MessageModule, AuthModule],
  providers: [ChatGateway],
})
export class ChatModule {}
