import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { environment } from 'src/core/consts/environment.const';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: environment.database.host,
  port: environment.database.port,
  username: environment.database.username,
  password: environment.database.password,
  database: environment.database.name,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  url: environment.database.url,
  ssl: true,
  synchronize: true,
};
