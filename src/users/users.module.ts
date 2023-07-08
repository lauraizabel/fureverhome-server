import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CommonModule } from 'src/core/core.module';
import { UsersRepository } from 'src/users/repository/users.repository';
import { UsersAddressRepository } from 'src/users/repository/users-address.repository';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AnimalsModule } from 'src/animals/animals.module';
import { FileModule } from 'src/file/file.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersAddressRepository, AuthGuard],
  imports: [
    TypeOrmModule.forFeature([User, UserAddress]),
    CommonModule,
    AnimalsModule,
    forwardRef(() => FileModule),
  ],
  exports: [UsersService, UsersRepository, UsersAddressRepository],
})
export class UsersModule {}
