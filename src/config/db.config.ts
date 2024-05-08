import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'test',
  entities: [`${__dirname}/../db/entities/*.entity{.ts,.js}`],
  synchronize: false,
  migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
}));
