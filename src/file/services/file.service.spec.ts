import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { UsersRepository } from 'src/users/repository/users.repository';
import { AnimalRepository } from 'src/animals/repository/animal.repository';
import { FileRepository } from 'src/file/repository/file.repository';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
      imports: [UsersRepository, AnimalRepository, FileRepository],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
