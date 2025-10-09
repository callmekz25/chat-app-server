import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import { Model, Types } from 'mongoose';
import { CreateMessageDto, GetMessageDto } from './message.dto';

import { ConversationService } from '@/conversations/conversation.service';
import { GetMessagesRes } from './types/message';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly converService: ConversationService,
  ) {}
  async createMessage(dto: CreateMessageDto) {
    const message = await this.messageModel.create({
      conversation_id: new Types.ObjectId(dto.conversationId),
      sendBy: new Types.ObjectId(dto.userId),
      message: dto.message,
      ...(dto.replyMessageId
        ? { replyMessageId: new Types.ObjectId(dto.replyMessageId) }
        : {}),
    });

    return {
      ...message.toObject(),
      seenBy: [],
    };
  }

  async getMessagesByConversationId(
    userId: string,
    conversationId: string,
    dto: GetMessageDto,
  ): Promise<GetMessagesRes> {
    const { before, limit } = dto;

    const participants =
      await this.converService.getParticipants(conversationId);

    const filter: any = {
      conversation_id: new Types.ObjectId(conversationId),
    };
    if (before) {
      filter._id = { $lt: new Types.ObjectId(before) };
    }

    const docs = await this.messageModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    const messages = [...docs].reverse();

    const messagesWithSeen = messages.map((m) => {
      const seenBy = participants
        .filter(
          (p) =>
            (p.user as Types.ObjectId) !== m.sendBy &&
            p.lastSeenMessage &&
            new Types.ObjectId(p.lastSeenMessage) >= new Types.ObjectId(m._id),
        )
        .map((p) => p.user);

      return { ...m, seenBy };
    });

    const nextCursor =
      docs.length === Number(limit) ? messages[0]._id.toString() : null;

    return {
      messages: messagesWithSeen,
      nextCursor,
    };
  }
}
