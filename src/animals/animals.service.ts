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
import { PageOptionsDto } from 'src/core/dto/page-options.dto';

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

  findAll(pageOptionsDto: PageOptionsDto) {
    return this.animalRepository.findAll(pageOptionsDto);
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

    if (currentAnimal?.files) {
      const deletedImages = currentAnimal.files?.map(({ fileId }) =>
        this.fileService.deleteFile(fileId),
      );

      await Promise.all(deletedImages);
    }

    return this.animalRepository.remove(id);
  }

  async uploadPicture(
    animalId: number,
    files: {
      base64Image: string;
      fileName: string;
    },
  ) {
    const animal = await this.findOne(animalId);
    const { fileName, base64Image } = files;
    const result = await this.fileService.uploadFile({
      base64Image,
      fileName,
      id: animalId,
      type: 'animal',
    });

    const animalFiles = animal.files || [];

    animal.files = [...animalFiles, result];

    const updatedAnimal = await this.animalRepository.update(animalId, animal);

    return { ...updatedAnimal };
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

  async findByUser(userId: number, pageOptionsDto: PageOptionsDto) {
    const user = await this.userService.findOne(userId);
    return this.animalRepository.findByUser(user, pageOptionsDto);
  }
}
