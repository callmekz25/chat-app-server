import { IsNotEmpty } from 'class-validator';

export class ICEPayloadDto {
  @IsNotEmpty()
  to: string;
  @IsNotEmpty()
  candidate: RTCIceCandidateInit;
  @IsNotEmpty()
  userId: string;
}
