import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FileController],
  providers: [FileService, JwtService],
})
export class FileModule {}
