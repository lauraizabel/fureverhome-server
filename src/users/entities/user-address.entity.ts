import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  street: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  neighborhood: string;

  @Column({ nullable: true })
  number?: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
