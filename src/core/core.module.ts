import { Module } from '@nestjs/common';
import { PasswordService } from 'src/core/services/password.service';

@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class CommonModule {}
