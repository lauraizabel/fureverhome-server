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
import { QueryInterface } from 'src/core/interfaces/query.interface';
import { AnimalType } from 'src/animals/enum/animal-type.enum';

@Injectable()
export class AnimalsService {
  constructor(
    private readonly animalRepository: AnimalRepository,
    private readonly fileService: FileService,
    private readonly userService: UsersService,
  ) {}

  async create(createAnimalDto: CreateAnimalDto, userId: number) {
    const user = await this.userService.findOne(userId);
    const newUser = this.addAnimalTypeInUser(createAnimalDto.type, user);
    const updatedUser = await this.userService.update(userId, newUser);
    const animal = await this.animalRepository.create({
      ...createAnimalDto,
      user: updatedUser,
    });

    return { ...animal };
  }

  async findAll(query: QueryInterface, userId: number) {
    const user = await this.userService.findOne(userId);
    return this.animalRepository.findAll(query, user);
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

    if (updateAnimalDto.type !== currentAnimal.type) {
      const user = await this.userService.findOne(userId);
      const newUser = this.removeAnimalTypeInUser(currentAnimal.type, user);
      const updatedUser = await this.userService.update(userId, newUser);
      const newUser_ = this.addAnimalTypeInUser(
        updateAnimalDto.type,
        updatedUser,
      );
      await this.userService.update(userId, newUser_);
    }

    const updatedAnimal = await this.animalRepository.update(
      id,
      updateAnimalDto,
    );

    return updatedAnimal;
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

    const user = await this.userService.findOne(userId);
    const newUser = this.removeAnimalTypeInUser(currentAnimal.type, user);
    await this.userService.update(userId, newUser);

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

    const newAnimal = { ...animal };
    const animalFiles = newAnimal.files || [];

    newAnimal.files = [...animalFiles, result];
    const updatedAnimal = await this.animalRepository.update(
      animalId,
      newAnimal,
    );

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

  private addAnimalTypeInUser(animalType: AnimalType, user: User) {
    const newUser = { ...user };
    const { animalTypes } = newUser;
    const isAnimalTypeInUser = animalTypes.some(
      (animalType_) => animalType_ === animalType,
    );

    if (!isAnimalTypeInUser) {
      newUser.animalTypes = [...animalTypes, animalType];
      return newUser;
    }

    return newUser;
  }

  private removeAnimalTypeInUser(animalType: AnimalType, user: User) {
    const newUser = { ...user };
    const { animalTypes } = newUser;

    const hasAnimalType = animalTypes.some(
      (animalType_) => animalType_ === animalType,
    );

    if (!hasAnimalType) return newUser;

    const countAnimalType = newUser.animal.filter(
      (animal) => animal.type === animalType,
    ).length;

    if (countAnimalType > 1) return newUser;

    const newAnimalTypes = animalTypes.filter(
      (animalType_) => animalType_ !== animalType,
    );

    newUser.animalTypes = newAnimalTypes;

    return newUser;
  }
}
