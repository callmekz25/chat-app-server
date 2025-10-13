import { IsNotEmpty, IsOptional } from 'class-validator';
import { ConversationType } from './conversation.schema';
import { Types } from 'mongoose';
import { Message } from '@/modules/messages/message.schema';

export class CreateConversationDto {
  @IsNotEmpty()
  otherUserId: string;

  @IsOptional()
  type: ConversationType;
}

export class ConversationResponseDto {
  _id: Types.ObjectId;
  type: ConversationType;
  name?: string;
  userName?: string;
  avatar?: { url?: string; publicId?: string };
  lastMessage?: Message;
}

export class UpdateLastMessageDto {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  messageId: string;
}

export class UpdateSeenMessageDto {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  messageId: string;
}
