import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  clientToUser = {};
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  identify(userId: string) {
    const user = this.usersRepository.findOne({ where: { id: userId } });
    return user;
  }

  getClientName = (clientId: string) => {
    return this.clientToUser[clientId];
  };
  async create(createMessageDto: CreateMessageDto, clientId: string) {
    console.log('clientId____', clientId);
    console.log('clientToUser', this.clientToUser[clientId]);
    const name = this.getClientName(clientId);

    console.log('HUI', name);

    const message = {
      name,
      text: createMessageDto.text,
    };
    // await this.messages.push(message);
    return message;
  }

  findAll() {
    // return this.messages;
  }

  async getDialogWithUsers(authorId: string, recipientId: string) {
    return await this.messageRepository.find({
      where: [
        { author: { id: authorId }, recipient: { id: recipientId } },
        {
          author: { id: recipientId },
          recipient: { id: authorId },
        },
      ],
    });
  }
}
