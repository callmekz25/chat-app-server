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
import { ConversationFullPopulated } from './types/conversationPopulated';

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

  async getOrCreateConversation(userId: string, otherUserId: string) {
    let conversation = await this.converModel
      .findOne({
        type: ConversationType.DIRECT,
        'participants.2': { $exists: false },
        participants: {
          $all: [
            {
              $elemMatch: { user: new Types.ObjectId(userId) },
            },
            { $elemMatch: { user: new Types.ObjectId(otherUserId) } },
          ],
        },
      })
      .lean<ConversationDocument>();
    if (!conversation) {
      conversation = await this.converModel.create({
        participants: [
          { user: new Types.ObjectId(userId) },
          { user: new Types.ObjectId(otherUserId) },
        ],
      });
    }
    return {
      conversationId: conversation._id,
    };
  }

  async getConversationById(conversationId: string) {
    if (!conversationId) {
      throw new BadRequestException();
    }
    const conversation = await this.converModel
      .findById(new Types.ObjectId(conversationId))
      .sort({ lastMessage: -1, updatedAt: -1 })
      .populate('participants.user', 'fullName _id userName avatar')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sendBy',
        },
      })
      .lean<ConversationFullPopulated>();
    if (!conversation) {
      throw new NotFoundException();
    }

    return {
      direct: conversation,
    };
  }

  async getConversations(userId: string) {
    const conversations = await this.converModel
      .find({
        'participants.user': new Types.ObjectId(userId),
        lastMessage: { $ne: null, $exists: true },
      })
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate('participants.user', 'fullName _id userName avatar')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sendBy',
        },
      })
      .lean<ConversationFullPopulated[]>();

    return {
      directs: conversations,
    };
  }

  async updateLastMessage(dto: UpdateLastMessageDto) {
    const conversation = await this.converModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(dto.conversationId) },
        {
          lastMessage: new Types.ObjectId(dto.messageId),
        },
        { new: true },
      )
      .populate('participants.user', 'fullName _id userName avatar')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sendBy',
        },
      })
      .lean<ConversationFullPopulated>();
    if (!conversation) {
      throw new NotFoundException();
    }
    return conversation;
  }

  async updateSeenMessage(dto: UpdateSeenMessageDto) {
    return this.converModel.updateOne(
      {
        _id: new Types.ObjectId(dto.conversationId),
        'participants.user': new Types.ObjectId(dto.userId),
      },
      {
        $set: {
          'participants.$.lastSeenMessage': new Types.ObjectId(dto.messageId),
        },
      },
    );
  }
}
