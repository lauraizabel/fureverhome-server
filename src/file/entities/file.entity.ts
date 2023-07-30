import { Animal } from 'src/animals/entities/animal.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  fileId: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.picture, {
    nullable: true,
    cascade: true,
  })
  user: User;

  @ManyToOne(() => Animal, (animal) => animal.files, {
    nullable: true,
  })
  animal: Animal;
}
