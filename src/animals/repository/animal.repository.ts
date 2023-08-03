import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnimalDto } from 'src/animals/dto/create-animal.dto';
import { UpdateAnimalDto } from 'src/animals/dto/update-animal.dto';
import { Animal } from 'src/animals/entities/animal.entity';
import { PageMetaDto } from 'src/core/dto/page-meta.dto';
import { PageOptionsDto } from 'src/core/dto/page-options.dto';
import { PageDto } from 'src/core/dto/page.dto';
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

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Animal>> {
    const queryBuilder = this.animalRepository.createQueryBuilder('animal');

    queryBuilder
      .leftJoinAndSelect('animal.user', 'user')
      .leftJoinAndSelect('animal.files', 'files')
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
