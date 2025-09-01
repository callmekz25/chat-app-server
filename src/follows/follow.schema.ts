import { User } from '@/users/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum Status {
  ACCEPTED = 'accepted',
  REQUESTED = 'requested',
}

@Schema({
  timestamps: true,
})
export class Follow {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  follower: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  following: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(Status), default: Status.ACCEPTED })
  status: Status;
}
export type FollowDocument = Follow & Document;
export const FollowSchema = SchemaFactory.createForClass(Follow);
