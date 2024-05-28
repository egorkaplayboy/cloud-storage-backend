import { Injectable, NotFoundException } from '@nestjs/common';
import { FileEntity } from '../db/entities/file.entity';
import { bytesToMegabytes, generateFileName } from './helper';
import { MapperFile } from './file.mapper';
import { SpaceEntity } from 'src/db/entities/space.entity';
import { randomUUID } from 'crypto';
import { SpaceType } from 'src/dto/space.dto';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class FileService extends BaseService {
  async uploadFile(file: Express.Multer.File, space_id: string) {
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
      user_id: this.context.user.id,
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

  async getFilesForSpace(space_id: string) {
    const result = await this.manager.findBy(FileEntity, {
      space_id,
      user_id: this.context.user.id,
    });
    return MapperFile.toBriefInfos(result);
  }

  async deleteFile(id: string) {
    const file = await this.manager.findOneBy(FileEntity, { id: id });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const space = await this.manager.findOneBy(SpaceEntity, {
      id: file.space_id,
    });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    await this.manager.update(
      SpaceEntity,
      { id: space.id },
      { usedMemory: space.usedMemory - file.size },
    );
    return file.id;
  }
}
