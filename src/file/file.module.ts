import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from 'src/address/address.service';
import { AnimalsModule } from 'src/animals/animals.module';
import { File } from 'src/file/entities/file.entity';
import { UserFile } from 'src/file/entities/user.file.entity';
import { FileRepository } from 'src/file/repository/file.repository';
import { UserFileRepository } from 'src/file/repository/user.file.repository';
import { FileService } from 'src/file/services/file.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [FileService, FileRepository, UserFileRepository, AddressService],
  imports: [
    forwardRef(() => AnimalsModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([File]),
    TypeOrmModule.forFeature([UserFile]),
  ],
  exports: [FileService],
})
export class FileModule {}
