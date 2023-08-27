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
    const conversation = await this.conversationService.createConversation(
      senderId,
      receiverId,
      content,
    );

    this.chatGateway.sendMessage({
      content,
      senderId,
      receiverId,
      chatId: `${conversation.sender.id}-${conversation.receiver.id}`,
    });

    return conversation;
  }
}
