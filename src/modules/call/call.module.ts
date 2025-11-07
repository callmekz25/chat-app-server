import { Module } from '@nestjs/common';
import { CallGateway } from './call.gateway';
import { ConversationModule } from '../conversations/conversation.module';

@Module({
  imports: [ConversationModule],
  providers: [CallGateway],
})
export class CallModule {}
