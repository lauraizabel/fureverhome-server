import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationController } from 'src/chat/conversation.controller';
import { ConversationService } from 'src/chat/service/conversation.service';
import { Message } from 'src/chat/entity/message.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chat/entity/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Chat]), UsersModule],
  controllers: [ConversationController],
  providers: [ConversationService, ChatGateway],
})
export class ChatModule {}
