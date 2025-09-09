import { Message } from './message.schema';

export type GetMessagesRes = {
  messages: Message[];
  nextCursor: string | null;
};
