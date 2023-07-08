import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { FileObject } from 'imagekit/dist/libs/interfaces';
import IKResponse from 'imagekit/dist/libs/interfaces/IKResponse';
import { AnimalRepository } from 'src/animals/repository/animal.repository';
import { environment } from 'src/core/consts/environment.const';
import { FileRepository } from 'src/file/repository/file.repository';
import { UsersRepository } from 'src/users/repository/users.repository';

interface UploadFile {
  type: 'animal' | 'user';
  base64Image: string;
  fileName: string;
  id: number;
}

@Injectable()
export class FileService {
  private imageKit: ImageKit;

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly animalRepository: AnimalRepository,
    private readonly fileRepository: FileRepository,
  ) {
    this.imageKit = new ImageKit({
      publicKey: environment.image.publicKey,
      privateKey: environment.image.privateKey,
      urlEndpoint: environment.image.urlEndpoint,
    });
  }

  async uploadFile(data: UploadFile) {
    const { base64Image, fileName, id, type } = data;
    const { url, fileId } = await this.imageKit.upload({
      file: base64Image,
      fileName: fileName,
    });

    if (type === 'user') {
      const user = await this.userRepository.findOne(id);
      const file = await this.fileRepository.create({ url, fileId, user });
      return file;
    } else {
      const animal = await this.animalRepository.findOne(id);
      const file = await this.fileRepository.create({ url, fileId, animal });
      return file;
    }
  }

  async deleteFile(fileId: string) {
    await this.fileRepository.remove(fileId);
    await this.imageKit.deleteFile(fileId);
  }

  async getFileDetails(fileId: string): Promise<IKResponse<FileObject>> {
    const details = await this.imageKit.getFileDetails(fileId);
    return details;
  }
}
