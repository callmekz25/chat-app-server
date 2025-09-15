import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { CreateMessageDto, GetMessageDto } from './message.dto';
import { GetMessagesRes } from './message.type';
import { ConversationService } from '@/conversations/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly converService: ConversationService,
  ) {}
  async createMessage(dto: CreateMessageDto) {
    const message = await this.messageModel.create({
      conversation_id: new Types.ObjectId(dto.conversation_id),
      user_id: new Types.ObjectId(dto.user_id),
      message: dto.message,
    });

    return {
      ...message.toObject(),
      seen_by: [],
    };
  }

  async getMessagesByConversationId(
    user_id: string,
    conversation_id: string,
    dto: GetMessageDto,
  ): Promise<GetMessagesRes> {
    const { before, limit } = dto;

    const participants =
      await this.converService.getParticipants(conversation_id);

    const filter: any = {
      conversation_id: new Types.ObjectId(conversation_id),
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
      const seen_by = participants
        .filter(
          (p) =>
            (p.user as Types.ObjectId).toString() !== m.user_id.toString() &&
            p.last_seen_message &&
            new Types.ObjectId(p.last_seen_message) >=
              new Types.ObjectId(m._id),
        )
        .map((p) => p.user);

      return { ...m, seen_by };
    });

    const nextCursor =
      docs.length === Number(limit) ? messages[0]._id.toString() : null;

    return {
      messages: messagesWithSeen,
      nextCursor,
    };
  }
}
