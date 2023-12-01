import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { Body } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.create(
      createMessageDto,
      client.id,
    );
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  join(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    console.log('name', name, client.id);
    return this.messagesService.identify(client.id);
  }

  @SubscribeMessage('typing')
  typing(
    @MessageBody('typing') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = this.messagesService.getClientName(client.id);

    client.broadcast.emit('typing', { name, isTyping });
  }

  async getDialog(@Body() authorId: string, recipientId: string) {
    return await this.messagesService.getDialogWithUsers(authorId, recipientId);
  }
}
