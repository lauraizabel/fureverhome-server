import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { UsersRepository } from 'src/users/repository/users.repository';
import { PasswordService } from 'src/core/services/password.service';
import { JwtService } from '@nestjs/jwt';
import { usersRepositoryMock } from 'src/core/mocks/user.repository.mock';
import { faker } from '@faker-js/faker';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let passwordService: PasswordService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthService,
        UsersRepository,
        PasswordService,
        JwtService,
        usersRepositoryMock,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    passwordService = module.get<PasswordService>(PasswordService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token and user object', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const accessToken = faker.git.commitSha();
      const user = { id: 1, name: 'John Doe' };

      jest.spyOn(authService, 'signIn').mockResolvedValueOnce({
        access_token: accessToken,
        user,
      });

      const result = await authController.signIn({ email, password });

      expect(result).toEqual({ access_token: accessToken, user });
      expect(authService.signIn).toHaveBeenCalledWith(email, password);
    });
  });
});
