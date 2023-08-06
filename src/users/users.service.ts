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

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersAddressRepository: UsersAddressRepository,
    private readonly passwordService: PasswordService,
    private readonly fileService: FileService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersRepository.findOneByEmail(
      createUserDto.email,
    );

    if (existUser) {
      throw new BadRequestException('Email already exists');
    }

    createUserDto.password = await this.passwordService.hashPassword(
      createUserDto.password,
    );

    const user = await this.usersRepository.create(createUserDto);
    const address = await this.usersAddressRepository.create({
      ...createUserDto,
      user,
    });

    const { password, ...rest } = user;

    return { ...address, ...rest, id: user.id };
  }

  getAll() {
    return this.usersRepository.findAll();
  }

  getAllOngs(pageOptionsDto: PageOptionsDto) {
    return this.usersRepository.findAllOngs(pageOptionsDto);
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
    console.log(user);
    try {
      const updatedUser = await this.usersRepository.update(user.id, user);
      return updatedUser;
    } catch (e) {
      console.log({ e });
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

    if (
      updateUserDto.newPassword &&
      updateUserDto.password &&
      updateUserDto.confirmPassword
    ) {
      const correctOldPassword = this.passwordService.comparePassword(
        updateUserDto.password,
        user.password,
      );

      if (!correctOldPassword) {
        throw new NotFoundException('Incorrect Password');
      }

      if (updateUserDto.newPassword !== updateUserDto.confirmPassword) {
        throw new NotFoundException('Passwords does not matches');
      }

      updateUserDto.password = await this.passwordService.hashPassword(
        updateUserDto.newPassword,
      );
    }

    return this.usersRepository.update(id, updateUserDto);
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
