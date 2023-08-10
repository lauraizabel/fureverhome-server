import { Animal } from 'src/animals/entities/animal.entity';
import { File } from 'src/file/entities/file.entity';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { UserType } from 'src/users/enum/user-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnimalType } from '../../animals/enum/animal-type.enum';
import { Message } from 'src/chat/entity/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  cnpj: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: [], array: true, enum: AnimalType, type: 'enum' })
  animalTypes: AnimalType[];

  @JoinColumn()
  @OneToOne(() => File, (file) => file.user, { nullable: true })
  picture?: File;

  @Column()
  type: UserType;

  @Column()
  dateOfBirth: Date;

  @OneToOne(() => UserAddress, (userAddress) => userAddress.user)
  userAddress!: UserAddress;

  @OneToMany(() => Animal, (animal) => animal.user)
  animal: Animal[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
