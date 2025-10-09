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
      client.data.userId = payload.sub;
      const { directs } = await this.conversationService.getConversations(
        client.data.userId,
      );
      directs.forEach((c) => client.join(c._id.toString()));
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected`);
  }

  @SubscribeMessage('conversation:typing')
  handleTyping(
    client: Socket,
    payload: { conversationId: string; userId: string },
  ) {
    this.server
      .to(payload.conversationId)
      .except(client.id)
      .emit('conversation:typing', payload);
  }

  @SubscribeMessage('conversation:stopTyping')
  handleStopTyping(
    client: Socket,
    payload: { conversationId: string; userId: string },
  ) {
    this.server
      .to(payload.conversationId)
      .except(client.id)
      .emit('conversation:stop_typing', payload);
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    client: Socket,
    payload: {
      conversationId: string;
      message: string;
      replyMessageId: string;
    },
  ) {
    const userId = client.data.userId;

    const message = await this.messageService.createMessage({
      ...payload,
      userId: userId,
    });
    const conversation = await this.conversationService.updateLastMessage({
      conversationId: payload.conversationId,
      messageId: message._id.toString(),
    });
    this.server.to(payload.conversationId).emit('message:new', {
      conversationId: payload.conversationId,
      message: message,
    });

    this.server
      .to(payload.conversationId)
      .emit('conversation:updated', conversation);
  }

  @SubscribeMessage('message:seen')
  async handleSeenMessage(
    client: Socket,
    payload: { conversationId: string; messageId: string },
  ) {
    const userId = client.data.userId;
    await this.conversationService.updateSeenMessage({
      ...payload,
      userId,
    });
    this.server.to(payload.conversationId).emit('message:seen:updated', {
      ...payload,
      userId,
    });
  }
}
