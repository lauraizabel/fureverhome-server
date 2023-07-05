import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'src/database/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/core/config/jwt.config';
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...databaseConfig }),
    JwtModule.register({ ...jwtConfig }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
