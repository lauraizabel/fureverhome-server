import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersAddressRepository } from 'src/users/repository/users-address.repository';
import { UsersRepository } from 'src/users/repository/users.repository';
import { PasswordService } from 'src/core/services/password.service';
import { usersRepositoryMock } from 'src/core/mocks/user.repository.mock';
import { usersAddressRepositoryMock } from 'src/core/mocks/user-address.repository.mock';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let usersAddressRepository: UsersAddressRepository;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        UsersAddressRepository,
        PasswordService,
        usersRepositoryMock,
        usersAddressRepositoryMock,
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    usersAddressRepository = module.get<UsersAddressRepository>(
      UsersAddressRepository,
    );
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
