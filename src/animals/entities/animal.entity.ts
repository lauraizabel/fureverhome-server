import { CommonColors } from 'src/animals/enum/animal-colors.enum';
import { AnimalDewormed } from 'src/animals/enum/animal-dewormed.enum';
import { AnimalType } from 'src/animals/enum/animal-type.enum';
import { File } from 'src/file/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnimalSize } from '../enum/animal-size.enum';
import { AnimalCastrated } from '../enum/animal-castrated.enum';
import { AnimalSex } from 'src/animals/enum/animal-sex.enum';
import { AnimalAge } from 'src/animals/enum/animal-age.enum';

@Entity()
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: AnimalType;

  @Column()
  color: CommonColors;

  @Column()
  description: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  dewormed: AnimalDewormed;

  @Column()
  size: AnimalSize;

  @Column()
  castrated: AnimalCastrated;

  @Column()
  age: AnimalAge;

  @Column()
  sex: AnimalSex;

  @ManyToOne(() => User, (user) => user.animal)
  user: User;

  @OneToMany(() => File, (file) => file.animal, {
    cascade: true,
  })
  files: File[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
