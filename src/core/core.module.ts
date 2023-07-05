import { Module } from '@nestjs/common';
import { PasswordService } from 'src/core/services/password.service';
import { UploadService } from 'src/core/services/upload.service';

@Module({
  providers: [PasswordService, UploadService],
  exports: [PasswordService, UploadService],
})
export class CommonModule {}
