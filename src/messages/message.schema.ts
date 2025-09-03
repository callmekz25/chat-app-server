import { User } from '@/users/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum MessageKind {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  FILE = 'file',
  VIDEO = 'video',
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  conversation_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Message.name })
  reply_message_id: Types.ObjectId;

  @Prop({
    type: [
      {
        user_id: {
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
    user_id: Types.ObjectId;
    emoji: string;
  }[];

  @Prop({
    type: [String],
    enum: Object.values(MessageKind),
    default: MessageKind.TEXT,
  })
  kind: MessageKind;

  @Prop()
  text: string;

  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;

  @Prop({ type: Boolean, default: false })
  is_edited: boolean;
}
export type MessageDocument = Document & Message;
export const MessageSchema = SchemaFactory.createForClass(Message);
