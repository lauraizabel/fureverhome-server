import { Exclude } from 'class-transformer';
import { Animal } from 'src/animals/entities/animal.entity';
import { File } from 'src/file/entities/file.entity';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { UserType } from 'src/users/enum/user-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  cnpj: string;

  @OneToOne(() => File, (file) => file.user)
  picture?: File;

  @Column()
  type: UserType;

  @Column()
  dateOfBirth: Date;

  @OneToOne(() => UserAddress, (userAddress) => userAddress.user)
  userAddress!: UserAddress;

  @OneToMany(() => Animal, (animal) => animal.user)
  animal: Animal[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
