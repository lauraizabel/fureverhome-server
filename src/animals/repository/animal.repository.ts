import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnimalDto } from 'src/animals/dto/create-animal.dto';
import { UpdateAnimalDto } from 'src/animals/dto/update-animal.dto';
import { Animal } from 'src/animals/entities/animal.entity';
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

  findAll() {
    return this.animalRepository.find({
      relations: ['files', 'user'],
    });
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

  findByUser(user: User) {
    const { id } = user;
    return this.animalRepository.find({
      where: { user: { id } },
      relations: ['files', 'user'],
    });
  }
}
