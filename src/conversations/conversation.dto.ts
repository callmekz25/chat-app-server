import { IsNotEmpty, IsOptional } from 'class-validator';
import { ConversationType } from './conversation.schema';
import { Types } from 'mongoose';

export class CreateConversationDto {
  @IsNotEmpty()
  other_user_id: string;

  @IsOptional()
  type: ConversationType;
}

export class ConversationResponseDto {
  _id: Types.ObjectId;
  type: ConversationType;
  name?: string;
  user_name?: string;
  avatar?: { url?: string; public_id?: string };
  last_message_at?: Date;
}

export class UpdateLastMessageDto {
  @IsNotEmpty()
  conversation_id: string;

  @IsNotEmpty()
  message_id: string;
}
