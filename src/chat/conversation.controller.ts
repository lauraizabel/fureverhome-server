import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ConversationService } from 'src/chat/service/conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get(':userId')
  async getConversationsByUser(@Param('userId') userId: number) {
    return this.conversationService.getConversationsByUser(userId);
  }

  @Post(':senderId/:receiverId')
  async createConversation(
    @Param('senderId') senderId: number,
    @Param('receiverId') receiverId: number,
    @Body('content') content: string,
  ) {
    const chat = await this.conversationService.createConversation(
      senderId,
      receiverId,
      content,
    );

    this.chatGateway.sendMessage({
      content,
      senderId,
      receiverId,
      chatId: `${chat.id}`,
    });

    return chat;
  }

  @Get('messages/:chatId')
  async getMessages(@Param('chatId') chatId: number) {
    return this.conversationService.getMessages(chatId);
  }

  @Post(':chatId/:senderId/send')
  async sendMessage(
    @Param('chatId') chatId: number,
    @Param('senderId') senderId: number,
    @Body('content') content: string,
  ) {
    const message = await this.conversationService.saveMessage(
      chatId,
      senderId,
      content,
    );

    this.chatGateway.sendMessage({
      content,
      senderId,
      receiverId:
        message.chat.sender.id === senderId
          ? message.chat.receiver.id
          : message.chat.sender.id,
      chatId: `${chatId}`,
    });

    return message;
  }
}
