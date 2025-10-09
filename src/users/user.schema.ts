import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  LEADER = 'leader',
}
export enum Providers {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Schema({ _id: false })
class UserProvider {
  @Prop({
    type: String,
    enum: Object.values(Providers),
    default: Providers.LOCAL,
  })
  provider: Providers;

  @Prop()
  providerId: string;

  @Prop()
  password?: string;
}

const UserProviderSchema = SchemaFactory.createForClass(UserProvider);

@Schema({
  timestamps: true,
})
export class User {
  _id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  userName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ type: [String], enum: Object.values(Role), default: [Role.USER] })
  roles: Role[];

  @Prop({ type: Boolean, default: false })
  isPrivate: boolean;

  @Prop({
    type: {
      avatarUrl: String,
      avatarPublicId: String,
    },
  })
  avatar?: {
    avatarUrl: string;
    avatarPublicId: string;
  };

  @Prop()
  bio?: string;

  @Prop({ type: String, enum: Object.values(Gender) })
  gender: Gender;

  @Prop({ type: Number, default: 0 })
  totalFollowers: number;

  @Prop({ type: Number, default: 0 })
  totalFollowings: number;

  @Prop({ type: Date, default: null })
  lastOnline: Date;

  @Prop({ type: [UserProviderSchema], default: [] })
  providers: UserProvider[];
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
