import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  receiver: User;
}
