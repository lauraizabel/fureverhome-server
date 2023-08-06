import { Controller, Get, Param } from '@nestjs/common';
import { ConversationService } from 'src/chat/service/conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':userId')
  async getConversationsByUser(@Param('userId') userId: number) {
    return this.conversationService.getConversationsByUser(userId);
  }
}
