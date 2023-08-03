import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserType } from '../enum/user-type.enum';
import { PageOptionsDto } from 'src/core/dto/page-options.dto';
import { PageMetaDto } from 'src/core/dto/page-meta.dto';
import { PageDto } from 'src/core/dto/page.dto';

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

  async findAllOngs(pageOptionsDto: PageOptionsDto) {
    const query = this.userRepository.createQueryBuilder('user');

    query
      .leftJoinAndSelect('user.animal', 'animal')
      .leftJoinAndSelect('user.userAddress', 'userAddress')
      .leftJoinAndSelect('user.picture', 'picture')
      .leftJoinAndSelect('animal.files', 'files')
      .where('user.type = :type', { type: UserType.ONG })
      .orderBy('user.id');

    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['animal', 'userAddress', 'picture', 'animal.files'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.save(updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
