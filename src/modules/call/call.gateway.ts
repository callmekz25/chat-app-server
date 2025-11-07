import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from '../conversations/conversation.service';

@WebSocketGateway({ cors: true })
export class CallGateway {
  constructor(private readonly conversationService: ConversationService) {}
  private userSocketMap = new Map<string, string>();

  @WebSocketServer() server: Server;

  @SubscribeMessage('register')
  handleRegister(client: Socket, userId: string) {
    this.userSocketMap.set(userId, client.id);
    console.log(`User ${userId} registered socket ${client.id}`);
  }

  @SubscribeMessage('call:offer')
  async handleOffer(
    client: Socket,
    payload: {
      conversationId: string;
      offer: RTCSessionDescriptionInit;
      callerId: string;
      callerName: string;
    },
  ) {
    console.log('Offer');

    try {
      const participants = await this.conversationService.getParticipants(
        payload.conversationId,
      );
      console.log('participants:', participants);

      for (const p of participants) {
        const userId = p.user._id.toString();
        if (userId === payload.callerId) continue;
        const targetSocket = this.userSocketMap.get(userId);

        if (targetSocket) {
          this.server.to(targetSocket).emit('call:offer', {
            callerId: payload.callerId,
            offer: payload.offer,
            callerName: payload.callerName,
          });
        }
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  @SubscribeMessage('call:answer')
  handleAnswer(
    client: Socket,
    payload: { to: string; answer: RTCSessionDescriptionInit; userId: string },
  ) {
    console.log('Answer');
    const targetSocket = this.userSocketMap.get(payload.to);
    if (targetSocket) {
      this.server.to(targetSocket).emit('call:answer', {
        from: payload.userId,
        answer: payload.answer,
      });
    }
  }

  @SubscribeMessage('call:ice-candidate')
  handleCandidate(
    client: Socket,
    payload: { to: string; candidate: RTCIceCandidateInit; userId: string },
  ) {
    const targetSocket = this.userSocketMap.get(payload.to);
    if (targetSocket) {
      this.server.to(targetSocket).emit('call:ice-candidate', {
        from: payload.userId,
        candidate: payload.candidate,
      });
    }
  }

  @SubscribeMessage('call:end')
  handleEnd(client: Socket, payload: { to: string; by: string }) {
    const targetSocket = this.userSocketMap.get(payload.to);
    if (targetSocket) {
      this.server.to(targetSocket).emit('call:end', { by: payload.by });
    }
  }
}
