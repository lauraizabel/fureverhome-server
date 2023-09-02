import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnimalDto } from 'src/animals/dto/create-animal.dto';
import { UpdateAnimalDto } from 'src/animals/dto/update-animal.dto';
import { Animal } from 'src/animals/entities/animal.entity';
import { PageMetaDto } from 'src/core/dto/page-meta.dto';
import { PageOptionsDto } from 'src/core/dto/page-options.dto';
import { PageDto } from 'src/core/dto/page.dto';
import { calculateHaversineDistance } from 'src/core/helpers/haversine';
import { QueryInterface } from 'src/core/interfaces/query.interface';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnimalRepository {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto) {
    const animal = this.animalRepository.create(createAnimalDto);
    const animal_ = await this.animalRepository.save(animal);
    return animal_;
  }

  async findAll(query: QueryInterface, user: User) {
    const queryBuilder = this.animalRepository.createQueryBuilder('animal');

    if (query.proximity && user) {
      const userLatitude = user.userAddress.latitude;
      const userLongitude = user.userAddress.longitude;
      queryBuilder
        .orderBy(
          `(6371 * acos(
          cos(radians(:userLatitude)) * cos(radians(userAddress.latitude))
          * cos(radians(userAddress.longitude) - radians(:userLongitude))
          + sin(radians(:userLatitude)) * sin(radians(userAddress.latitude))
        ))`,
          'ASC',
        )
        .setParameter('userLatitude', userLatitude)
        .setParameter('userLongitude', userLongitude)
        .setParameter('maxDistance', query.proximity)
        .getMany();
    }

    queryBuilder
      .andWhere('user.id != :userId', { userId: user.id })
      .leftJoinAndSelect('animal.user', 'user')
      .leftJoinAndSelect('user.userAddress', 'userAddress')
      .leftJoinAndSelect('animal.files', 'files');

    if (query.type) {
      queryBuilder.andWhere('animal.type = :type', {
        type: query.type,
      });
    }

    if (query.minAge) {
      queryBuilder.andWhere('animal.age >= :minAge', {
        minAge: query.minAge,
      });
    }

    if (query.maxAge) {
      queryBuilder.andWhere('animal.age <= :maxAge', {
        maxAge: query.maxAge,
      });
    }

    if (query.size) {
      queryBuilder.andWhere('animal.size = :size', {
        size: query.size,
      });
    }

    if (query.sex) {
      queryBuilder.andWhere('animal.sex = :sex', {
        sex: query.sex,
      });
    }

    const { entities } = await queryBuilder.getRawAndEntities();

    const animals = entities.map((entity) => {
      if (!entity.user.userAddress) return entity;
      const distance = calculateHaversineDistance(
        user.userAddress.latitude,
        user.userAddress.longitude,
        entity.user.userAddress.latitude,
        entity.user.userAddress.longitude,
      );

      return {
        ...entity,
        user: {
          ...entity.user,
          distance: distance,
        },
      };
    });

    const sortedAnimals = animals.sort((a: any, b: any) => {
      return a.user?.distance - b.user?.distance;
    });

    const parsedAnimals = sortedAnimals.map((animal) => {
      const { user } = animal;
      if (!(user as any).distance) return animal;
      return {
        ...animal,
        user: {
          ...user,
          distance: (user as any).distance.toFixed(2),
        },
      };
    });

    return parsedAnimals;
  }

  findOne(id: number) {
    return this.animalRepository.findOne({
      where: { id },
      relations: ['user', 'files'],
    });
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    const animalToBeUpdated = {
      ...updateAnimalDto,
      id,
    };
    const animal = await this.animalRepository.save(animalToBeUpdated);
    return animal;
  }

  remove(id: number) {
    return this.animalRepository.delete({ id });
  }

  async findByUser(user: User, query: QueryInterface) {
    const { id } = user;

    const queryBuilder = this.animalRepository.createQueryBuilder('animal');

    queryBuilder
      .leftJoinAndSelect('animal.user', 'user')
      .leftJoinAndSelect('animal.files', 'files')
      .where('user.id = :id', { id })
      .orderBy('animal.id');

    if (query.type) {
      queryBuilder.andWhere('animal.type = :type', {
        type: query.type,
      });
    }

    if (query.minAge) {
      queryBuilder.andWhere('animal.age >= :minAge', {
        minAge: query.minAge,
      });
    }

    if (query.maxAge) {
      queryBuilder.andWhere('animal.age <= :maxAge', {
        maxAge: query.maxAge,
      });
    }

    if (query.size) {
      queryBuilder.andWhere('animal.size = :size', {
        size: query.size,
      });
    }

    if (query.sex) {
      queryBuilder.andWhere('animal.sex = :sex', {
        sex: query.sex,
      });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return entities;
  }
}
