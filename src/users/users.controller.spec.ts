import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersRepositoryMock } from 'src/core/mocks/user.repository.mock';
import { usersAddressRepositoryMock } from 'src/core/mocks/user-address.repository.mock';
import { UsersRepository } from 'src/users/repository/users.repository';
import { UsersAddressRepository } from 'src/users/repository/users-address.repository';
import { PasswordService } from 'src/core/services/password.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersRepository: UsersRepository;
  let usersAddressRepository: UsersAddressRepository;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        UsersAddressRepository,
        PasswordService,
        usersRepositoryMock,
        usersAddressRepositoryMock,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
});
