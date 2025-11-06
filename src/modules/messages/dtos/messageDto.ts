import { User } from '@/modules/users/user.schema';
import { AttachmentType, Message, MessageType } from '../message.schema';

export class MessageDto {
  _id: string;

  sendBy: User;

  conversationId: string;

  replyMessage?: Message;

  reactions: {
    reactBy: User;
    emoji: string;
  }[];

  messageType: MessageType;

  message: string;

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

  isDeleted: boolean;

  isEdited: boolean;

  seenBy: [];
  createdAt: string;
}
