import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, payload: { chatId: string }) {
    client.join(payload.chatId);
    console.log(`Client ${client.id} joined chat ${payload.chatId}`);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(payload: {
    chatId: string;
    content: string;
    senderId: number;
    receiverId: number;
  }) {
    this.server.to(payload.chatId).emit('message', payload);
    console.log(`Message sent to chat ${payload.chatId}: ${payload.content}`);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, payload: { chatId: string }) {
    client.leave(payload.chatId);
    console.log(`Client ${client.id} left chat ${payload.chatId}`);
  }
}
