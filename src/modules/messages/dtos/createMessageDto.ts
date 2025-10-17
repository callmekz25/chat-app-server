import { IsNotEmpty, IsOptional } from 'class-validator';
import { AttachmentType } from '../message.schema';

export class CreateMessageDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  message: string;

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
