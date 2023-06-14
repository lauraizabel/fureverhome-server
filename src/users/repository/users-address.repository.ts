import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersAddressRepository {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {}

  async create({ state, street, number, neighborhood }: CreateUserDto) {
    const address_ = this.userAddressRepository.create({
      state,
      street,
      number,
      neighborhood,
    });
    await this.userAddressRepository.save(address_);
    return address_;
  }

  findOne(id: number) {
    return this.userAddressRepository.findOneBy({ id });
  }

  update(id: number, { state, street, number, neighborhood }: UpdateUserDto) {
    return this.userAddressRepository.update(id, {
      state,
      street,
      number,
      neighborhood,
    });
  }
}
