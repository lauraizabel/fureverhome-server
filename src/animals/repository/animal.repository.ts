import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnimalDto } from 'src/animals/dto/create-animal.dto';
import { UpdateAnimalDto } from 'src/animals/dto/update-animal.dto';
import { Animal } from 'src/animals/entities/animal.entity';
import { PageMetaDto } from 'src/core/dto/page-meta.dto';
import { PageOptionsDto } from 'src/core/dto/page-options.dto';
import { PageDto } from 'src/core/dto/page.dto';
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

  async findAll(query: QueryInterface): Promise<PageDto<Animal>> {
    const queryBuilder = this.animalRepository.createQueryBuilder('animal');

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

    queryBuilder
      .leftJoinAndSelect('animal.user', 'user')
      .leftJoinAndSelect('animal.files', 'files')
      .orderBy('animal.id')
      .skip(query.skip)
      .take(query.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: query,
      itemCount,
    });

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number) {
    return this.animalRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  update(id: number, updateUserDto: UpdateAnimalDto) {
    return this.animalRepository.save(updateUserDto);
  }

  remove(id: number) {
    return this.animalRepository.delete({ id });
  }

  async findByUser(user: User, pageOptionsDto: PageOptionsDto) {
    const { id } = user;

    const queryBuilder = this.animalRepository.createQueryBuilder('animal');

    queryBuilder
      .leftJoinAndSelect('animal.user', 'user')
      .leftJoinAndSelect('animal.files', 'files')
      .where('user.id = :id', { id })
      .orderBy('animal.id')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount,
    });

    return new PageDto(entities, pageMetaDto);
  }
}
