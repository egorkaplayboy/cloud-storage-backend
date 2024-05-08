import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { FileEntity } from '../db/entities/file.entity';
import { EntityManager } from 'typeorm';
import { bytesToMegabytes, generateFileName } from './helper';
import { MapperFile } from './file.mapper';
import { SpaceEntity } from 'src/db/entities/space.entity';
import { randomUUID } from 'crypto';
import { SpaceType } from 'src/dto/space.dto';

@Injectable()
export class FileService {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    space_id: string,
  ) {
    if (!file.size) {
      throw new Error('Error uploading file');
    }

    const space = await this.manager.findOneBy(SpaceEntity, { id: space_id });
    if (!space) throw new NotFoundException('Space not found');

    const newFile = this.manager.create(FileEntity, {
      originalName: file.originalname,
      data: file.buffer,
      filename: generateFileName(file.originalname),
      mimetype: file.mimetype,
      size: bytesToMegabytes(file.size),
      user_id: userId,
      space_id,
      id: randomUUID(),
    });

    if (
      bytesToMegabytes(file.size) > space.maxFileSizeUpload &&
      space.type === SpaceType.FREE
    )
      throw new Error('You cannot upload a file larger than 100 megabytes');

    if (
      bytesToMegabytes(file.size) > space.maxFileSizeUpload &&
      space.type === SpaceType.PAID
    )
      throw new Error('You cannot upload a file larger than 10 gigabytes');

    if (bytesToMegabytes(file.size) + space.usedMemory > space.totalMemory)
      throw new Error('The space is crowded');

    await this.manager.update(
      SpaceEntity,
      { id: space_id },
      { usedMemory: space.usedMemory + bytesToMegabytes(file.size) },
    );

    const savedFile = await this.manager.save(newFile);

    return MapperFile.toBriefInfo(savedFile);
  }

  async getFileById(id: string) {
    const file = await this.manager.findOneBy(FileEntity, { id });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async getFilesForSpace(space_id: string, user_id: string) {
    const query = `select * from files where space_id = $1 and user_id = $2`;

    const result = await this.manager.query(query, [space_id, user_id]);
    return MapperFile.toBriefInfos(result);
  }
}
