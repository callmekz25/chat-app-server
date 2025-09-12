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
} from './conversation.schema';
import { UpdateLastMessageDto, UpdateSeenMessageDto } from './conversation.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly converModel: Model<ConversationDocument>,
  ) {}

  async getParticipants(conversation_id: string) {
    const conversation = await this.converModel
      .findById(new Types.ObjectId(conversation_id))
      .lean<ConversationDocument>();
    if (!conversation) {
      throw new NotFoundException();
    }
    return conversation.participants;
  }

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
      .populate('last_message')
      .lean<ConversationDocument>();
    if (!conversation) {
      throw new NotFoundException();
    }

    return {
      direct: conversation,
    };
  }

  async getConversations(user_id: string) {
    const conversations = await this.converModel
      .find({
        'participants.user': new Types.ObjectId(user_id),
        last_message: { $ne: null, $exists: true },
      })
      .sort({ last_message_at: -1, updatedAt: -1 })
      .populate(
        'participants.user',
        'full_name _id user_name avatar_url avatar_public_id',
      )
      .populate('last_message')
      .lean<ConversationDocument[]>();

    return {
      directs: conversations,
    };
  }

  async updateLastMessage(dto: UpdateLastMessageDto, user_id: string) {
    const conversation = await this.converModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(dto.conversation_id) },
        {
          last_message: new Types.ObjectId(dto.message_id),
          last_message_at: new Date(),
        },
        { new: true },
      )
      .populate(
        'participants.user',
        'full_name _id user_name avatar_url avatar_public_id',
      )
      .populate('last_message')
      .lean<ConversationDocument>();
    if (!conversation) {
      throw new NotFoundException();
    }
    return conversation;
  }

  async updateSeenMessage(dto: UpdateSeenMessageDto) {
    return this.converModel.updateOne(
      {
        _id: new Types.ObjectId(dto.conversation_id),
        'participants.user': new Types.ObjectId(dto.user_id),
      },
      {
        $set: {
          'participants.$.last_read_at': new Date(),
          'participants.$.last_seen_message': new Types.ObjectId(
            dto.message_id,
          ),
        },
      },
    );
  }
}
