import { Controller, Inject, Get, Param } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';
import { MessageService } from 'src/chat/service/message.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    @Inject(ChatGateway) private readonly chatGateway: ChatGateway,
  ) {}

  @Get(':senderId/:receiverId')
  async getChatMessages(
    @Param('senderId') senderId: number,
    @Param('receiverId') receiverId: number,
  ) {
    return this.messageService.getMessages(senderId, receiverId);
  }
}
