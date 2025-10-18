import { AttachmentType, MessageType } from '@/modules/messages/message.schema';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  tempId: string;

  @IsNotEmpty()
  @IsString()
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
