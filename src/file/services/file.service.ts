import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { FileObject } from 'imagekit/dist/libs/interfaces';
import IKResponse from 'imagekit/dist/libs/interfaces/IKResponse';
import { Animal } from 'src/animals/entities/animal.entity';
import { AnimalRepository } from 'src/animals/repository/animal.repository';
import { environment } from 'src/core/consts/environment.const';
import { FileRepository } from 'src/file/repository/file.repository';
import { UserFileRepository } from 'src/file/repository/user.file.repository';
import { UsersRepository } from 'src/users/repository/users.repository';

interface UploadFile {
  base64Image: string;
  fileName: string;
}

@Injectable()
export class FileService {
  private imageKit: ImageKit;

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly animalRepository: AnimalRepository,
    private readonly fileRepository: FileRepository,
    private readonly userFileRepository: UserFileRepository,
  ) {
    this.imageKit = new ImageKit({
      publicKey: environment.image.publicKey,
      privateKey: environment.image.privateKey,
      urlEndpoint: environment.image.urlEndpoint,
    });
  }

  async uploadUserFile(base64Image: string, fileName: string, userId: number) {
    const { url, fileId } = await this.imageKit.upload({
      file: base64Image,
      fileName: fileName,
    });

    const user = await this.userRepository.findOne(userId);
    const file = await this.userFileRepository.create({ url, fileId, user });
    return file;
  }

  async uploadAnimalFile(
    base64Image: string,
    fileName: string,
    animalId: number,
  ) {
    const { url, fileId } = await this.imageKit.upload({
      file: base64Image,
      fileName: fileName,
    });

    const animal = await this.animalRepository.findOne(animalId);
    const file = await this.fileRepository.create({ url, fileId, animal });
    return file;
  }

  async deleteFile(fileId: string) {
    await this.fileRepository.remove(fileId);
    await this.imageKit.deleteFile(fileId);
  }

  async uploadAnimalFiles(files: UploadFile[], animal: Animal) {
    const promises = files.map(async (file) => {
      const { url, fileId } = await this.imageKit.upload({
        file: file.base64Image,
        fileName: file.fileName,
      });

      const file_ = await this.fileRepository.create({ url, fileId, animal });
      return file_;
    });

    const files_ = await Promise.all(promises);
    return files_;
  }

  async getFileDetails(fileId: string): Promise<IKResponse<FileObject>> {
    const details = await this.imageKit.getFileDetails(fileId);
    return details;
  }
}
