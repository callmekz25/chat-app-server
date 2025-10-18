import { User } from '@/modules/users/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum MessageType {
  TEXT = 'text',
  CALL = 'call',
  CALLVIDEO = 'callvideo',
  VOICE = 'voice',
}

export enum AttachmentType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sendBy: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Message.name })
  replyMessage?: Types.ObjectId | Message;

  @Prop({
    type: [
      {
        reactBy: {
          type: Types.ObjectId,
          ref: User.name,
          required: true,
        },
        emoji: { type: String, required: true },
      },
    ],
    default: [],
  })
  reactions: {
    reactBy: Types.ObjectId | User;
    emoji: string;
  }[];

  @Prop({
    type: String,
    enum: Object.values(MessageType),
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Prop()
  message: string;

  @Prop({
    type: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        type: {
          type: String,
          enum: Object.values(AttachmentType),
          required: true,
        },
        fileName: String,
        fileSize: Number,
        duration: Number,
        width: Number,
        height: Number,
      },
    ],
  })
  attachments?: {
    url: string;
    publicId: string;
    type: MessageType;
    fileName?: string;
    fileSize?: number;
    fileFormat?: string;
    duration?: number;
    width?: number;
    height?: number;
  }[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isEdited: boolean;

  @Prop()
  createdAt: string;
}
export type MessageDocument = Document & Message;
export const MessageSchema = SchemaFactory.createForClass(Message);
