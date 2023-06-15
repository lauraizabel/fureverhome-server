import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/repository/users.repository';
import { PasswordService } from 'src/core/services/password.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserType } from 'src/users/enum/user-type.enum';
import { usersRepositoryMock } from 'src/core/mocks/user.repository.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let passwordService: PasswordService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    email: faker.internet.email(),
    password: faker.internet.password(),
    cpf: '12311935496',
    createdAt: new Date(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    job: faker.person.jobTitle(),
    picture: faker.internet.url(),
    type: UserType.FISICAL,
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersRepository,
        PasswordService,
        JwtService,
        usersRepositoryMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    passwordService = module.get<PasswordService>(PasswordService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return access token and user data if email and password are correct', async () => {
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('access_token');

      const result = await authService.signIn(mockUser.email, 'password');

      const { password, ...userWithoutPassword } = mockUser;

      expect(result).toEqual({
        access_token: 'access_token',
        user: {
          ...userWithoutPassword,
        },
      });
      expect(usersRepository.findOneByEmail).toBeCalledWith(mockUser.email);

      expect(passwordService.comparePassword).toBeCalledWith(
        'password',
        mockUser.password,
      );

      expect(jwtService.signAsync).toBeCalledWith({
        sub: 1,
        email: mockUser.email,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        authService.signIn(mockUser.email, 'password'),
      ).rejects.toThrowError(NotFoundException);
      expect(usersRepository.findOneByEmail).toBeCalledWith(mockUser.email);
    });

    it('should throw BadRequestException if email or password is wrong', async () => {
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(false);

      await expect(
        authService.signIn(mockUser.email, 'wrong_password'),
      ).rejects.toThrowError(BadRequestException);
      expect(usersRepository.findOneByEmail).toBeCalledWith(mockUser.email);
      expect(passwordService.comparePassword).toBeCalledWith(
        'wrong_password',
        mockUser.password,
      );
    });
  });
});
