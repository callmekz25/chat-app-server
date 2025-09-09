import { JwtPayload } from '@/auth/types/jwt-payload';
import { ConversationService } from '@/conversations/conversation.service';
import { CreateMessageDto } from '@/messages/message.dto';
import { MessageService } from '@/messages/message.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Socket server init');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected`);
    const token = client.handshake.auth.token;
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      client.data.user_id = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected`);
  }

  @SubscribeMessage('conversation:join')
  async onJoinConversation(
    client: Socket,
    payload: { conversation_id: string },
  ) {
    const { conversation_id } = payload;
    const user_id = client.data.user_id;

    await client.join(conversation_id);

    await this.conversationService.updateSeenMessage({
      conversation_id,
      user_id,
    });
  }
  @SubscribeMessage('conversation:leave')
  async onLeaveConversation(
    client: Socket,
    payload: { conversation_id: string },
  ) {
    const { conversation_id } = payload;

    await client.leave(conversation_id);
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    client: Socket,
    payload: { conversation_id: string; message: string },
  ) {
    console.log('Message:', payload);

    const user_id = client.data.user_id;

    const message = await this.messageService.createMessage({
      user_id: user_id,
      message: payload.message,
      conversation_id: payload.conversation_id,
    });
    await this.conversationService.updateLastMessage({
      conversation_id: payload.conversation_id,
      message_id: message._id.toString(),
    });
    this.server.to(payload.conversation_id).emit('message:new', {
      conversation_id: payload.conversation_id,
      message: message,
    });
  }
}
