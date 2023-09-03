import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from 'src/users/repository/users.repository';
import { UsersAddressRepository } from 'src/users/repository/users-address.repository';
import { PasswordService } from 'src/core/services/password.service';
import { FileService } from 'src/file/services/file.service';
import { PageOptionsDto } from 'src/core/dto/page-options.dto';
import { AddressService } from 'src/address/address.service';
import { User } from 'src/users/entities/user.entity';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { QueryInterface } from 'src/core/interfaces/query.interface';
import { REGEX_CPF } from 'src/core/consts/errors-content.const';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersAddressRepository: UsersAddressRepository,
    private readonly passwordService: PasswordService,
    private readonly fileService: FileService,
    private readonly addressService: AddressService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersRepository.findOneByEmail(
      createUserDto.email,
    );

    if (existUser) {
      throw new BadRequestException('Email already exists');
    }

    if (createUserDto.cpf) {
      const isCpfValid = createUserDto.cpf.match(REGEX_CPF);
      if (!isCpfValid) {
        throw new BadRequestException('Invalid CPF');
      }
    }

    createUserDto.password = await this.passwordService.hashPassword(
      createUserDto.password,
    );

    const user = await this.usersRepository.create(createUserDto);

    const positions = await this.addressService.getCoordinatesByAddress(
      `${createUserDto.street}, ${createUserDto.number}, ${createUserDto.city} - ${createUserDto.state}`,
    );
    const address = await this.usersAddressRepository.create({
      ...createUserDto,
      user,
      latitude: positions.lat,
      longitude: positions.lng,
    });

    const { password, ...rest } = user;

    return { ...address, ...rest, id: user.id };
  }

  getAll() {
    return this.usersRepository.findAll();
  }

  getAllOngs(query: QueryInterface, userId: number) {
    return this.usersRepository.findAllOngs(query, userId);
  }

  async uploadPicture(userId: number, base64Image: string, fileName: string) {
    const user = await this.findOne(userId);

    const result = await this.fileService.uploadFile({
      base64Image,
      fileName,
      id: userId,
      type: 'user',
    });

    user.picture = result;
    try {
      await this.usersRepository.update(user.id, user);
      return result;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async deletePicture(userId: number, fileId: string) {
    const file = await this.fileService.getFileDetails(fileId);

    if (!file) {
      throw new BadRequestException('File not found');
    }

    const user = await this.findOne(userId);

    await this.fileService.deleteFile(fileId);

    user.picture = null;

    const updatedUser = await this.usersRepository.update(user.id, user);

    return updatedUser;
  }

  findOne(id: number) {
    const user = this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }
    const userAddress: UserAddress = {
      street: updateUserDto.street ?? user.userAddress.street,
      number: updateUserDto.number ?? user.userAddress.number,
      city: updateUserDto.city ?? user.userAddress.city,
      state: updateUserDto.state ?? user.userAddress.state,
      user,
      id: user.userAddress.id,
      neighborhood: updateUserDto.neighborhood ?? user.userAddress.neighborhood,
    } as UserAddress;

    const positions = await this.addressService.getCoordinatesByAddress(
      `${userAddress.street}, ${userAddress.number}, ${userAddress.city} - ${userAddress.state}`,
    );

    userAddress.latitude = positions.lat;
    userAddress.longitude = positions.lng;

    await this.usersAddressRepository.update(userAddress.id, userAddress);

    const userToBeUpdated: User = {
      firstName: updateUserDto.firstName || user.firstName,
      lastName: updateUserDto.lastName || user.lastName,
      email: updateUserDto.email || user.email,
      password: updateUserDto.password,
      id: user.id,
      picture: user.picture,
      animal: user.animal,
      cnpj: updateUserDto.cnpj || user.cnpj,
      cpf: updateUserDto.cpf || user.cpf,
      description: updateUserDto.description || user.description,
      phone: updateUserDto.phone || user.phone,
      type: updateUserDto.type || user.type,
      dateOfBirth: updateUserDto.dateOfBirth || user.dateOfBirth,
      receivedChats: user.receivedChats,
      sentChats: user.sentChats,
      job: updateUserDto.job || user.job,
      animalTypes: updateUserDto.animalTypes || user.animalTypes,
    } as User;
    const newUser = await this.usersRepository.update(id, userToBeUpdated);

    return {
      ...newUser,
      userAddress,
    };
  }

  async delete(id: number) {
    const user = this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersRepository.remove(id);
  }

  async changePassword(id: number, oldPassword: string, password: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    const correctOldPassword = this.passwordService.comparePassword(
      oldPassword,
      user.password,
    );

    if (!correctOldPassword) {
      throw new NotFoundException('Incorrect Password');
    }

    user.password = await this.passwordService.hashPassword(password);

    return this.usersRepository.update(id, user);
  }
}
