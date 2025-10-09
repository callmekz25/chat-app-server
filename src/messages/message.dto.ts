import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  replyMessageId: string;
}

export class GetMessageDto {
  @IsOptional()
  before: string;

  @IsOptional()
  limit = 20;
}
