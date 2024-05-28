import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SpaceModule } from './space/space.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './config';
import { BaseModule } from './base/base.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [DatabaseConfig] }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    BaseModule,
    FileModule,
    UsersModule,
    AuthModule,
    SpaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
