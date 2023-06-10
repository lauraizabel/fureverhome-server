import { environment } from 'src/consts/environment.const';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: environment.database.host,
        port: environment.database.port,
        username: environment.database.username,
        password: environment.database.password,
        database: environment.database.name,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
