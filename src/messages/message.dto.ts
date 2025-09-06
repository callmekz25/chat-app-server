import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  conversation_id: string;

  @IsNotEmpty()
  message: string;
}
