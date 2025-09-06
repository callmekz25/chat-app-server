import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConversationModule } from '@/conversations/conversation.module';
import { MessageModule } from '@/messages/message.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [ConversationModule, MessageModule, AuthModule],
  providers: [ChatGateway],
})
export class ChatModule {}
