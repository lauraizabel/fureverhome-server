import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationController } from 'src/chat/conversation.controller';
import { MessageController } from 'src/chat/message.controller';
import { MessageService } from 'src/chat/service/message.service';
import { ConversationService } from 'src/chat/service/conversation.service';
import { Message } from 'src/chat/entity/message.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User]), UsersModule],
  controllers: [ConversationController, MessageController],
  providers: [MessageService, ConversationService, ChatGateway],
})
export class ChatModule {}
