import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
  ConversationType,
  Participant,
} from './conversation.schema';
import {
  ConversationResponseDto,
  CreateConversationDto,
} from './conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/users/user.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly converModel: Model<ConversationDocument>,
  ) {}

  async getOrCreateConversation(user_id: string, other_user_id: string) {
    let conversation = await this.converModel
      .findOne({
        type: ConversationType.DIRECT,
        'participants.2': { $exists: false },
        participants: {
          $all: [
            {
              $elemMatch: { user: new Types.ObjectId(user_id) },
            },
            { $elemMatch: { user: new Types.ObjectId(other_user_id) } },
          ],
        },
      })
      .lean<ConversationDocument>();
    if (!conversation) {
      conversation = await this.converModel.create({
        participants: [
          { user: new Types.ObjectId(user_id) },
          { user: new Types.ObjectId(other_user_id) },
        ],
        last_message_at: new Date(),
      });
    }
    return {
      conversation_id: conversation._id,
    };
  }

  async getConversationById(user_id: string, conversation_id: string) {
    if (!conversation_id) {
      throw new BadRequestException();
    }
    const conversation = await this.converModel
      .findById(new Types.ObjectId(conversation_id))
      .sort({ last_message_at: -1, updatedAt: -1 })
      .populate('participants.user', 'full_name _id user_name avatar')
      .lean<ConversationDocument>();
    if (!conversation) {
      throw new NotFoundException();
    }
    let direct: ConversationResponseDto | null = null;
    if (conversation.type === ConversationType.GROUP) {
      direct = {
        _id: conversation._id,
        type: conversation.type,
        name: conversation.name,
        avatar: conversation.avatar,
        last_message_at: conversation.last_message_at,
      };
    } else {
      const other = conversation.participants.find(
        (p: Participant) => p.user._id.toString() !== user_id,
      );

      direct = {
        _id: conversation._id,
        type: conversation.type,
        name: (other?.user as User).full_name,
        user_name: (other?.user as User).user_name,
        avatar: {
          url: (other?.user as User).avatar_url,
          public_id: (other?.user as User).avatar_public_id,
        },
        last_message_at: conversation.last_message_at,
      };
    }
    return {
      direct: direct,
    };
  }

  async getConversations(user_id: string) {
    const conversations = await this.converModel
      .find({ 'participants.user': new Types.ObjectId(user_id) })
      .sort({ last_message_at: -1, updatedAt: -1 })
      .populate('participants.user', 'full_name _id user_name avatar')
      .lean<ConversationDocument[]>();

    const result = conversations.map((c: ConversationDocument) => {
      if (c.type === ConversationType.GROUP) {
        return {
          _id: c._id,
          type: c.type,
          name: c.name,
          avatar: c.avatar,
          last_message_at: c.last_message_at,
        };
      }

      const other = c.participants.find(
        (p: Participant) => p.user._id.toString() !== user_id,
      );
      return {
        _id: c._id,
        type: c.type,
        name: (other?.user as User).full_name,
        avatar: {
          url: (other?.user as User).avatar_url,
          public_id: (other?.user as User).avatar_public_id,
        },
        last_message_at: c.last_message_at,
      };
    });
    return {
      directs: result,
    };
  }
}
