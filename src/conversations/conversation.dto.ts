import { IsNotEmpty } from 'class-validator';
import { ConversationType } from './conversation.schema';

export class CreateConversationDto {
  @IsNotEmpty()
  participants: {
    user: string;
  }[];

  @IsNotEmpty()
  type: ConversationType;
}
