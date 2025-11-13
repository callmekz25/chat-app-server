import { IsNotEmpty } from 'class-validator';

export class OfferPayloadDto {
  @IsNotEmpty()
  conversationId: string;
  @IsNotEmpty()
  offer: RTCSessionDescriptionInit;
  @IsNotEmpty()
  callerId: string;
  @IsNotEmpty()
  callerName: string;
}
