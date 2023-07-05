import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { environment } from 'src/core/consts/environment.const';

@Injectable()
export class UploadService {
  private imageKit: ImageKit;

  constructor() {
    this.imageKit = new ImageKit({
      publicKey: environment.image.publicKey,
      privateKey: environment.image.privateKey,
      urlEndpoint: environment.image.urlEndpoint,
    });
  }

  async uploadFile({
    base64Image,
    fileName,
  }: {
    base64Image: string;
    fileName: string;
  }) {
    const result = await this.imageKit.upload({
      file: base64Image,
      fileName: fileName,
    });
    const { url } = result;
    return url;
  }
}
