import { Message } from 'src/messages/entities/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];
}
