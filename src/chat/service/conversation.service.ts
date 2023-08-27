import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chat/entity/message.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async createConversation(
    senderId: number,
    receiverId: number,
    content: string,
  ) {
    const sender = await this.usersService.findOne(senderId);
    const receiver = await this.usersService.findOne(receiverId);
    const message = new Message();
    message.sender = sender;
    message.receiver = receiver;
    message.content = content;
    return this.messageRepository.save(message);
  }

  async getConversationsByUser(userId: number) {
    const conversations = await this.messageRepository.find({
      where: [
        {
          sender: {
            id: userId,
          },
        },
        {
          receiver: {
            id: userId,
          },
        },
      ],
      order: {
        createdAt: 'DESC',
      },
      relations: ['sender', 'receiver', 'sender.picture', 'receiver.picture'],
    });

    const uniqueConversations = conversations.filter(
      (conversation, index, self) => {
        const indexOfDuplicate = self.findIndex(
          (c) =>
            c.receiver.id === conversation.receiver.id &&
            c.sender.id === conversation.sender.id,
        );
        return indexOfDuplicate === index;
      },
    );

    const chat = uniqueConversations.map((conversation) => ({
      user: {
        id: conversation.receiver.id,
        name: conversation.receiver.firstName,
        picture: conversation.receiver?.picture?.url,
      },
      lastMessage: {
        id: conversation.id,
        content: conversation.content,
        createdAt: conversation.createdAt,
      },
      userSentLastMessage: conversation.sender.id === userId,
    }));
    return { chat };
  }
}
