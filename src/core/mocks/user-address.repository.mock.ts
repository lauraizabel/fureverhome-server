import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAddress } from 'src/users/entities/user-address.entity';

export const usersAddressRepositoryMock = {
  provide: getRepositoryToken(UserAddress),
  useValue: {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
};
