import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  provider_id: string;

  @Prop()
  password?: string;
}

const UserProviderSchema = SchemaFactory.createForClass(UserProvider);

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  user_name: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ type: [String], enum: Object.values(Role), default: [Role.USER] })
  roles: Role[];

  @Prop({ type: Boolean, default: false })
  isPrivate: boolean;

  @Prop()
  avatar_url?: string;

  @Prop()
  avatar_public_id?: string;

  @Prop()
  bio?: string;

  @Prop({ type: String, enum: Object.values(Gender) })
  gender: Gender;

  @Prop({ type: Number, default: 0 })
  total_followers: number;

  @Prop({ type: Number, default: 0 })
  total_followings: number;

  @Prop({ type: [UserProviderSchema], default: [] })
  providers: UserProvider[];
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
