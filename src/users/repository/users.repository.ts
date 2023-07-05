import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { FindOptionsSelectByString, Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  private readonly rowsToBeSelected: FindOptionsSelectByString<User> = [
    'cpf',
    'createdAt',
    'email',
    'firstName',
    'id',
    'job',
    'lastName',
    'picture',
    'type',
    'updatedAt',
  ];
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const user_ = await this.userRepository.save(user);
    return user_;
  }

  findAll() {
    return this.userRepository.find({
      select: this.rowsToBeSelected,
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: this.rowsToBeSelected,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
