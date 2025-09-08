import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  conversation_id: string;

  @IsNotEmpty()
  message: string;
}

export class GetMessageDto {
  @IsOptional()
  before: string;

  @IsOptional()
  limit = 20;
}
