import { Message } from '@/modules/messages/message.schema';
import { Conversation } from '../conversation.schema';
import { PopulatedMany } from '@/utils/popuplated';
import { User } from '@/modules/users/user.schema';

export type ConversationFullPopulated = PopulatedMany<
  Conversation,
  {
    lastMessasge: Message;
    'participants.user': User[];
  }
>;
