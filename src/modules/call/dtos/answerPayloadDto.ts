import { IsNotEmpty } from 'class-validator';

export class AnswerPayloadDto {
  @IsNotEmpty()
  to: string;
  @IsNotEmpty()
  answer: RTCSessionDescriptionInit;
  @IsNotEmpty()
  userId: string;
}
