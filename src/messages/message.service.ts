import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import { Model, Types } from 'mongoose';
import { CreateMessageDto, GetMessageDto } from './message.dto';
import { GetMessagesRes } from './message.type';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(dto: CreateMessageDto) {
    return await this.messageModel.create({
      conversation_id: new Types.ObjectId(dto.conversation_id),
      user_id: new Types.ObjectId(dto.user_id),
      message: dto.message,
    });
  }

  async getMessagesByConversationId(
    conversation_id: string,
    dto: GetMessageDto,
  ): Promise<GetMessagesRes> {
    const { before, limit } = dto;

    const filter: any = {
      conversation_id: new Types.ObjectId(conversation_id),
    };
    if (before) {
      filter._id = { $lt: new Types.ObjectId(before) };
    }

    const docs = await this.messageModel
      .find(filter)
      .sort({ _id: -1 }) // newest → oldest
      .limit(limit)
      .lean();

    // đảo lại cho UI: oldest → newest
    const messages = [...docs].reverse();

    // cursor = id của message cũ nhất trong batch (để load older)
    const nextCursor =
      docs.length === Number(limit) ? messages[0]._id.toString() : null;

    return {
      messages,
      nextCursor,
      hasMore: !!nextCursor,
    };
  }
}
