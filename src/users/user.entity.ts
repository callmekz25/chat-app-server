import { UserProvider } from 'src/user-providers/user-providers.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'text' })
  email: string;

  @Column({ unique: true, type: 'text' })
  user_name: string;

  @Column({ type: 'text' })
  full_name: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  avatar_public_id: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'bigint', default: 0 })
  total_followers: string;

  @Column({ type: 'bigint', default: 0 })
  total_following: string;

  @OneToMany(() => UserProvider, (provider) => provider.user, {
    cascade: ['insert'],
  })
  providers: UserProvider[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
