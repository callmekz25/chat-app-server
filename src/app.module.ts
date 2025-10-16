import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from '@/modules/users/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { ProfileModule } from '@/modules/profile/profile.module';
import { ConversationModule } from '@/modules/conversations/conversation.module';
import { MessageModule } from '@/modules/messages/message.module';
import { ChatModule } from '@/modules/chat/chat.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProfileModule,
    MessageModule,
    ConversationModule,
    ChatModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
