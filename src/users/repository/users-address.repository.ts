import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersAddressRepository {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {}

  async create({
    state,
    street,
    number,
    neighborhood,
    user,
    city,
    latitude,
    longitude,
  }: CreateUserDto & { user: User } & {
    latitude?: number;
    longitude?: number;
  }) {
    const address = this.userAddressRepository.create({
      state,
      street,
      number,
      neighborhood,
      user,
      latitude,
      longitude,
      city,
    });
    const savedAddress = await this.userAddressRepository.save(address);
    return savedAddress;
  }

  findOne(id: number) {
    return this.userAddressRepository.findOneBy({ id });
  }

  update(
    id: number,
    {
      state,
      street,
      number,
      neighborhood,
      city,
      latitude,
      longitude,
    }: UpdateUserDto,
  ) {
    return this.userAddressRepository.update(id, {
      state,
      street,
      number,
      neighborhood,
      latitude,
      longitude,
      city,
    });
  }
}
