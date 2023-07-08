import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsModule } from 'src/animals/animals.module';
import { File } from 'src/file/entities/file.entity';
import { FileRepository } from 'src/file/repository/file.repository';
import { FileService } from 'src/file/services/file.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [FileService, FileRepository],
  imports: [
    forwardRef(() => AnimalsModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([File]),
  ],
  exports: [FileService],
})
export class FileModule {}
