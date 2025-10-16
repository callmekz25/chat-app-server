import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageType } from './message.schema';

export class CreateMessageDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  replyMessageId: string;

  @IsOptional()
  attachments?: {
    url: string;
    publicId: string;
    type: MessageType;
    fileName?: string;
    fileSize?: number;
    duration?: number;
    width?: number;
    height?: number;
  }[];
}

export class GetMessageDto {
  @IsOptional()
  before: string;

  @IsOptional()
  limit = 20;
}
