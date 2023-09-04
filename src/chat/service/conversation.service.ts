import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chat/entity/chat.entity';
import { Message } from 'src/chat/entity/message.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
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
    const chat = new Chat();
    chat.sender = sender;
    chat.receiver = receiver;
    const savedChat = await this.chatRepository.save(chat);
    await this.messageRepository.save({
      chat: savedChat,
      sender,
      content,
    });
    return this.chatRepository.findOne({
      where: { id: savedChat.id },
      relations: ['sender', 'receiver', 'messages', 'messages.sender'],
    });
  }

  async saveMessage(chatId: number, senderId: number, content: string) {
    const sender = await this.usersService.findOne(senderId);
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    return this.messageRepository.save({
      chat,
      sender,
      content,
    });
  }

  async getMessages(chatId: number) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['messages', 'messages.sender', 'sender', 'receiver'],
    });

    return chat;
  }

  async getConversationsByUser(userId: number) {
    const chats = await this.chatRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      order: { createdAt: 'DESC' },
      relations: ['sender', 'receiver', 'messages', 'messages.sender'],
    });

    const chatList = chats.map((chat) => {
      const lastMessage = chat.messages[0];
      const otherUser =
        chat.sender.id === userId ? chat.receiver : lastMessage.sender;

      return {
        user: {
          id: otherUser.id,
          name: `${otherUser.firstName} ${otherUser.lastName}`,
          picture: otherUser.picture?.url,
        },
        lastMessage: {
          id: lastMessage.id,
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
        },
        userSentLastMessage: lastMessage.sender.id === userId,
        id: chat.id,
      };
    });

    return { chat: chatList };
  }
}
