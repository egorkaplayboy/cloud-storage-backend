import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entitiesMap } from 'src/db/entities/all-entities';
import { BaseService } from './base.service';

@Module({
  imports: [TypeOrmModule.forFeature([...Object.values(entitiesMap)])],
  providers: [BaseService],
  exports: [BaseService],
})
export class BaseModule {}
