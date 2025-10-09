import { Conversation } from '@/conversations/conversation.schema';
import { User } from '@/users/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  FILE = 'file',
  VIDEO = 'video',
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sendBy: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversation: Types.ObjectId | Conversation;

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

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isEdited: boolean;

  @Prop()
  createdAt: string;
}
export type MessageDocument = Document & Message;
export const MessageSchema = SchemaFactory.createForClass(Message);
