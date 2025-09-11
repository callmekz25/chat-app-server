import { Message } from '@/messages/message.schema';
import { User } from '@/users/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
}

export class Participant {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId | User;

  @Prop({ type: String, enum: ['member', 'leader'], default: 'member' })
  role: 'member' | 'leader';

  @Prop({ type: Date, default: Date.now })
  joined_at: Date;

  @Prop({ type: Date })
  last_read_at?: Date;

  @Prop({ type: Types.ObjectId, ref: Message.name })
  last_seen_message: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Conversation {
  _id: Types.ObjectId;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: User.name },
        role: { type: String, enum: ['member', 'leader'], default: 'member' },
        joined_at: { type: Date, default: Date.now },
        last_read_at: { type: Date },
        last_seen_message: { type: Types.ObjectId, ref: Message.name },
      },
    ],
    default: [],
  })
  participants: Participant[];

  @Prop({
    type: String,
    enum: Object.values(ConversationType),
    default: ConversationType.DIRECT,
  })
  type: ConversationType;

  @Prop()
  name?: string;

  @Prop({
    type: {
      url: { type: String },
      public_id: { type: String },
    },
  })
  avatar?: {
    url: string;
    public_id: string;
  };

  @Prop({ type: Types.ObjectId, ref: Message.name })
  last_message?: Types.ObjectId | Message;

  @Prop({ type: Date })
  last_message_at?: Date;
}
export type ConversationDocument = Document & Conversation;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
