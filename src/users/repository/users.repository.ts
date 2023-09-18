import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserType } from '../enum/user-type.enum';
import { calculateHaversineDistance } from 'src/core/helpers/haversine';
import { QueryInterface } from 'src/core/interfaces/query.interface';

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

  async findAllOngs(query: QueryInterface, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userAddress'],
    });

    if (!user) {
      return null;
    }

    const { name, type } = query;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.animal', 'animal')
      .leftJoinAndSelect('user.userAddress', 'userAddress')
      .leftJoinAndSelect('user.picture', 'picture')
      .leftJoinAndSelect('animal.files', 'files')
      .addSelect([
        'user',
        `(6371 * acos(
        cos(radians(:userLatitude)) * cos(radians(userAddress.latitude))
        * cos(radians(userAddress.longitude) - radians(:userLongitude))
        + sin(radians(:userLatitude)) * sin(radians(userAddress.latitude))
      )) AS distance`,
      ])
      .where('user.type = :type', { type: UserType.ONG })
      .andWhere('user.id != :userId', { userId })
      .andWhere(
        `(6371 * acos(
        cos(radians(:userLatitude)) * cos(radians(userAddress.latitude))
        * cos(radians(userAddress.longitude) - radians(:userLongitude))
        + sin(radians(:userLatitude)) * sin(radians(userAddress.latitude))
      )) <= :maxDistance`,
        {
          userLatitude: user.userAddress.latitude,
          userLongitude: user.userAddress.longitude,
          maxDistance: query.proximity || 20,
        },
      );

    if (name) {
      queryBuilder.andWhere(
        'user.firstName ILIKE :text OR user.lastName ILIKE :text',
        { text: `%${name}%` },
      );
    }

    const [users] = await queryBuilder.getManyAndCount();

    let formattedUsers = users.map((selectedUser) => {
      const distance = calculateHaversineDistance(
        selectedUser.userAddress.latitude,
        selectedUser.userAddress.longitude,
        user.userAddress.latitude,
        user.userAddress.longitude,
      );

      return {
        ...selectedUser,
        distance: parseFloat(distance.toFixed(2)),
      };
    });

    if (type) {
      formattedUsers = formattedUsers.filter((user) => {
        return user.animal.some((animal) => animal.type === type);
      });
    }

    const sortedUsers = formattedUsers.sort((a, b) => {
      return a.distance - b.distance;
    });

    const sortedUsersWithStringDistance = sortedUsers.map((user) => ({
      ...user,
      distance: user.distance.toString(),
    }));

    return sortedUsersWithStringDistance;
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['animal', 'userAddress', 'picture', 'animal.files'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.save({ ...updateUserDto, id });
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
