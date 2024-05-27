import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../db/entities/file.entity';
import { JwtService } from '@nestjs/jwt';
import { SpaceEntity } from 'src/db/entities/space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, SpaceEntity])],
  controllers: [FileController],
  providers: [FileService, JwtService],
})
export class FileModule {}
