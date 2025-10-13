import { Message } from '@/modules/messages/message.schema';
import { User } from '@/modules/users/user.schema';
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
  joinedAt: Date;

  @Prop({ type: Types.ObjectId, ref: Message.name })
  lastSeenMessage: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Conversation {
  _id: Types.ObjectId;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: User.name },
        role: { type: String, enum: ['member', 'leader'], default: 'member' },
        joinedAt: { type: Date, default: Date.now },
        lastSeenMessage: { type: Types.ObjectId, ref: Message.name },
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
      publicId: { type: String },
    },
  })
  avatar?: {
    url: string;
    publicId: string;
  };

  @Prop({ type: Types.ObjectId, ref: Message.name })
  lastMessage?: Types.ObjectId | Message;
}
export type ConversationDocument = Document & Conversation;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
