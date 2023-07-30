import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserType } from '../enum/user-type.enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
      relations: ['userAddress', 'animal'],
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const user_ = await this.userRepository.save(user);
    return user_;
  }

  findAll() {
    return this.userRepository.find();
  }

  findAllOngs() {
    return this.userRepository.find({
      where: {
        type: UserType.ONG,
      },
      relations: ['animal', 'userAddress', 'picture'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.save(updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
