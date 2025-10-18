import { IsNotEmpty, IsOptional } from 'class-validator';
import { AttachmentType, MessageType } from '../message.schema';

export class CreateMessageDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  messageType: MessageType;

  @IsOptional()
  replyMessageId?: string;

  @IsOptional()
  attachments?: {
    url: string;
    publicId: string;
    type: AttachmentType;
    fileName?: string;
    fileSize?: number;
    duration?: number;
    width?: number;
    height?: number;
  }[];
}
