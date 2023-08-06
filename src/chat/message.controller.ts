import { Controller, Post, Body, Inject, Get, Param } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';
import { MessageService } from 'src/chat/service/message.service';
import { User } from 'src/users/entities/user.entity';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    @Inject(ChatGateway) private readonly chatGateway: ChatGateway,
  ) {}

  @Post()
  async sendMessage(
    @Body('sender') sender: User,
    @Body('receiver') receiver: User,
    @Body('content') content: string,
  ) {
    const message = await this.messageService.sendMessage(
      sender,
      receiver,
      content,
    );
    this.chatGateway.sendMessage(sender.id, receiver.id, content);
    return message;
  }

  @Get(':senderId/:receiverId')
  async getChatMessages(
    @Param('senderId') senderId: number,
    @Param('receiverId') receiverId: number,
  ) {
    return this.messageService.getMessages(senderId, receiverId);
  }
}
