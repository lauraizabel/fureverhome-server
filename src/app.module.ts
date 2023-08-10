import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'src/database/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/core/config/jwt.config';
import { AnimalsModule } from './animals/animals.module';
import { FileModule } from './file/file.module';
import { ChatGateway } from 'src/chat/chat.gateway';
import { AddressService } from './address/address.service';
import { RequestLoggingMiddleware } from 'src/core/middlewares/ request-logging.middleware';
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...databaseConfig }),
    JwtModule.register({ ...jwtConfig }),
    FileModule,
    UsersModule,
    AuthModule,
    AnimalsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, AddressService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
