import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chat/entity/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async sendMessage(
    sender: User,
    receiver: User,
    content: string,
  ): Promise<Message> {
    const message = new Message();
    message.sender = sender;
    message.receiver = receiver;
    message.content = content;
    return this.messageRepository.save(message);
  }

  async getMessages(senderId: number, receiverId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      order: { id: 'ASC' },
    });
  }
}
