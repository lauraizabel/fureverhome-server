import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chat/entity/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getConversationsByUser(userId: number) {
    const conversations = await this.messageRepository
      .createQueryBuilder('message')
      .select(
        'DISTINCT ON (receiver.id) receiver.id AS user_id, receiver.name AS user_name, message.*',
      )
      .leftJoin('message.receiver', 'receiver')
      .where('message.senderId = :userId OR message.receiverId = :userId', {
        userId,
      })
      .orderBy('receiver.id', 'ASC')
      .addOrderBy('message.id', 'DESC')
      .getRawMany();

    return conversations.map((conversation) => ({
      user: { id: conversation.user_id, name: conversation.user_name },
      lastMessage: {
        id: conversation.message_id,
        content: conversation.message_content,
        createdAt: conversation.message_createdAt,
      },
    }));
  }
}
