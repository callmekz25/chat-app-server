import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
  ConversationType,
  Participant,
} from './conversation.schema';
import { CreateConversationDto } from './conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/users/user.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly converModel: Model<ConversationDocument>,
  ) {}

  async createConversation(user_id: string, dto: CreateConversationDto) {
    const pariticipants = [
      ...dto.participants,
      {
        user: new Types.ObjectId(user_id),
      },
    ];
    await this.converModel.create({
      type: dto.type,
      participants: pariticipants,
    });
    return {
      message: 'Create conversation successfully',
    };
  }

  async getConversations(user_id: string) {
    const conversations = await this.converModel
      .find({ 'participants.user': new Types.ObjectId(user_id) })
      .sort({ last_message_at: -1, updatedAt: -1 })
      .populate('participants.user', 'full_name _id user_name avatar')
      .lean<ConversationDocument[]>();

    return conversations.map((c: ConversationDocument) => {
      if (c.type === ConversationType.GROUP) {
        return {
          conversation_id: c._id,
          type: c.type,
          title: c.title,
          avatar: c.avatar,
          last_message_at: c.last_message_at,
        };
      }

      const other = c.participants.find(
        (p: Participant) => p.user._id.toString() !== user_id,
      );
      return {
        conversation_id: c._id,
        type: c.type,
        title: (other?.user as User).full_name,
        avatar: {
          url: (other?.user as User).avatar_url,
          public_id: (other?.user as User).avatar_public_id,
        },
        last_message_at: c.last_message_at,
      };
    });
  }
}
