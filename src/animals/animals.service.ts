import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalRepository } from 'src/animals/repository/animal.repository';
import { FileService } from 'src/file/services/file.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AnimalsService {
  constructor(
    private readonly animalRepository: AnimalRepository,
    private readonly fileService: FileService,
    private readonly userService: UsersService,
  ) {}

  async create(createAnimalDto: CreateAnimalDto, userId: number) {
    const user = await this.userService.findOne(userId);
    const animal = await this.animalRepository.create({
      ...createAnimalDto,
      user,
    });
    return { ...animal };
  }

  findAll() {
    return this.animalRepository.findAll();
  }

  findOne(id: number) {
    const animal = this.animalRepository.findOne(id);
    if (!animal) {
      throw new NotFoundException('Animal not found');
    }
    return animal;
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto, userId: number) {
    const currentAnimal = await this.findOne(id);

    if (currentAnimal.user.id !== userId) {
      throw new BadRequestException('Current user is not the animal owner');
    }

    const updatedUser = await this.animalRepository.update(id, updateAnimalDto);

    return updatedUser;
  }

  async remove(id: number, userId: number) {
    const currentAnimal = await this.findOne(id);

    if (currentAnimal.user.id !== userId) {
      throw new BadRequestException('Current user is not the animal owner');
    }

    return this.animalRepository.remove(id);
  }

  async uploadPicture(
    animalId: number,
    files: {
      base64Image: string;
      fileName: string;
    }[],
  ) {
    const animal = await this.findOne(animalId);
    const filesError = [];

    const promiseFiles = files.map(async ({ base64Image, fileName }) => {
      const result = await this.fileService.uploadFile({
        base64Image,
        fileName,
        id: animalId,
        type: 'animal',
      });
      return result;
    });

    const files_ = await Promise.all(promiseFiles);

    animal.files = files_;

    const updatedAnimal = await this.animalRepository.update(animalId, animal);

    return { ...updatedAnimal, filesError };
  }

  async deletePicture(animalId: number, fileId: string) {
    const file = await this.fileService.getFileDetails(fileId);

    if (!file) {
      throw new BadRequestException('File not found');
    }

    const animal = await this.findOne(animalId);

    await this.fileService.deleteFile(fileId);

    const newFiles = animal.files.filter(
      ({ fileId: fileId_ }) => fileId !== fileId_,
    );

    animal.files = newFiles;

    const updatedAnimal = await this.animalRepository.update(animalId, animal);

    return updatedAnimal;
  }

  async findByUser(userId: number) {
    const user = await this.userService.findOne(userId);
    return this.animalRepository.findByUser(user);
  }
}
