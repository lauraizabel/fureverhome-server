import {
  BadRequestException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from 'src/users/repository/users.repository';
import { UsersAddressRepository } from 'src/users/repository/users-address.repository';
import { PasswordService } from 'src/core/services/password.service';
import { UploadService } from 'src/core/services/upload.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersAddressRepository: UsersAddressRepository,
    private readonly passwordService: PasswordService,
    private readonly uploadService: UploadService,
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

    if (createUserDto.picture) {
      createUserDto.picture = await this.uploadService.uploadFile({
        base64Image: createUserDto.picture,
        fileName: `${createUserDto.firstName}_${new Date().toISOString()}`,
      });
    }

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
}
