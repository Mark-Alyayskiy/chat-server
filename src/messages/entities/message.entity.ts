import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'CASCADE',
  })
  recipient: User;
}
