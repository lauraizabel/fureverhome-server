import { Module, forwardRef } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from 'src/animals/entities/animal.entity';
import { AnimalRepository } from 'src/animals/repository/animal.repository';
import { FileModule } from 'src/file/file.module';
import { AddressService } from 'src/address/address.service';

@Module({
  controllers: [AnimalsController],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => FileModule),
    CommonModule,
    TypeOrmModule.forFeature([Animal]),
  ],
  providers: [AnimalsService, AuthGuard, AnimalRepository, AddressService],
  exports: [AnimalsService, AnimalRepository],
})
export class AnimalsModule {}
