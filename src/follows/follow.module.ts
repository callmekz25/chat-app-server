import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './follow.schema';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { UserModule } from '@/users/user.module';
import { FollowRepository } from './follow.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    UserModule,
  ],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
  exports: [FollowService],
})
export class FollowModule {}
