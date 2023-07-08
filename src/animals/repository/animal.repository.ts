import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnimalDto } from 'src/animals/dto/create-animal.dto';
import { UpdateAnimalDto } from 'src/animals/dto/update-animal.dto';
import { Animal } from 'src/animals/entities/animal.entity';
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
    return this.animalRepository.find();
  }

  findOne(id: number) {
    return this.animalRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateAnimalDto) {
    return this.animalRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.animalRepository.delete({ id });
  }
}
