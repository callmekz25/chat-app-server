import { User } from '@/users/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name, unique: true })
  user: Types.ObjectId;
  @Prop({ required: true })
  content: string;

  @Prop({
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  })
  expiresAt: Date;
}

export type NoteDocument = Note & Document;
export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
