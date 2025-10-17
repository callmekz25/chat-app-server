import { IsOptional } from 'class-validator';

export class GetMessageDto {
  @IsOptional()
  before: string;

  @IsOptional()
  limit = 20;
}
