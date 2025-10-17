import { IsNotEmpty, IsString } from 'class-validator';

export class SeenMessageDto {
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  messageId: string;
}
