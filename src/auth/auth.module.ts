import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/core/core.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [CommonModule, UsersModule],
})
export class AuthModule {}
