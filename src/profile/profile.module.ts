import { FollowModule } from '@/follows/follow.module';
import { NoteModule } from '@/notes/note.module';
import { UserModule } from '@/users/user.module';
import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UserModule, FollowModule, NoteModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
