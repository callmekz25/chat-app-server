import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ConversationDocument } from './conversation.schema';

@Injectable()
export class ConversationService {
  constructor(private readonly converModel: Model<ConversationDocument>) {}
}
