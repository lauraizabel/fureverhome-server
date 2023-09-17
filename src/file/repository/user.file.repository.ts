import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFileDTO } from 'src/file/dto/create-file.dto';
import { UpdateFileDTO } from 'src/file/dto/update-file.dto';
import { UserFile } from 'src/file/entities/user.file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserFileRepository {
  constructor(
    @InjectRepository(UserFile)
    private readonly fileRepository: Repository<UserFile>,
  ) {}

  async create(createFileDto: CreateFileDTO) {
    const file = this.fileRepository.create(createFileDto);
    const file_ = await this.fileRepository.save(file);
    return file_;
  }

  findOne(fileId: string) {
    return this.fileRepository.findOne({
      where: { fileId },
    });
  }

  update(id: number, updateFileDto: UpdateFileDTO) {
    return this.fileRepository.update(id, updateFileDto);
  }

  remove(fileId: string) {
    return this.fileRepository.delete({ fileId });
  }
}
