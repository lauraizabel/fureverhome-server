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
import { calculateHaversineDistance } from 'src/core/helpers/haversine';

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

  async findAllOngs(pageOptionsDto: PageOptionsDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userAddress'],
    });

    if (!user) {
      return null;
    }

    const { skip, take } = pageOptionsDto;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.animal', 'animal')
      .leftJoinAndSelect('user.userAddress', 'userAddress')
      .leftJoinAndSelect('user.picture', 'picture')
      .leftJoinAndSelect('animal.files', 'files')
      .where('user.type = :type', { type: UserType.ONG })
      .andWhere(
        `(6371 * acos(
          cos(radians(:userLatitude)) * cos(radians(userAddress.latitude))
          * cos(radians(userAddress.longitude) - radians(:userLongitude))
          + sin(radians(:userLatitude)) * sin(radians(userAddress.latitude))
        )) <= :maxDistance`,
        {
          userLatitude: user.userAddress.latitude,
          userLongitude: user.userAddress.longitude,
          maxDistance: 10,
        },
      )
      .orderBy('user.id')
      .skip(skip)
      .take(take);

    const [users, itemCount] = await queryBuilder.getManyAndCount();

    const formattedUsers = users.map((selectedUser) => {
      const distance = calculateHaversineDistance(
        selectedUser.userAddress.latitude,
        selectedUser.userAddress.longitude,
        user.userAddress.latitude,
        user.userAddress.longitude,
      );

      return {
        ...selectedUser,
        distance: distance.toFixed(2),
      };
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(formattedUsers, pageMetaDto);
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
