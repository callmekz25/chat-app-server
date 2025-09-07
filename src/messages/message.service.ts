import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import { Model, Types } from 'mongoose';
import { CreateMessageDto } from './message.dto';

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

  async getMessagesByConversationId(conversation_id: string) {
    const messages = await this.messageModel.find({
      conversation_id: new Types.ObjectId(conversation_id),
    });
    console.log(messages);

    return {
      messages: messages,
    };
  }
}
