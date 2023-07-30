import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/core/services/password.service';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/repository/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comparePasswords = await this.passwordService.comparePassword(
      pass,
      user.password,
    );

    if (!comparePasswords) {
      throw new BadRequestException('Email or password wrong');
    }

    const loadedUser = await this.usersRepository.findOne(user.id);

    const { password, ...result } = loadedUser;

    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: result,
    };
  }
}
