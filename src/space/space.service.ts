import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SpaceType } from 'src/dto/space.dto';
import { SpaceEntity } from 'src/db/entities/space.entity';
import { FileEntity } from 'src/db/entities/file.entity';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class SpaceService extends BaseService {
  async createTrial(name: string) {
    const space = this.manager.create(SpaceEntity, {
      id: randomUUID(),
      name,
      user_id: this.context.user.id,
    });
    await this.manager.save(space);
    return space;
  }

  async createPaid(name: string) {
    const space = this.manager.create(SpaceEntity, {
      id: randomUUID(),
      name,
      user_id: this.context.user.id,
      type: SpaceType.PAID,
      totalMemory: 1024 * 1024,
      maxFileSizeUpload: 10 * 1024,
    });
    await this.manager.save(space);
    return space;
  }

  async updateToPaid(id: string) {
    const existsSpace = await this.manager.findOneBy(SpaceEntity, { id });
    if (!existsSpace) throw new UnprocessableEntityException('Space not found');
    if (existsSpace.type === SpaceType.PAID)
      throw new Error('Space already paid');
    await this.manager.update(
      SpaceEntity,
      { id },
      {
        type: SpaceType.PAID,
        totalMemory: 1024 * 1024,
        maxFileSizeUpload: 10 * 1024,
      },
    );
    return { id };
  }

  async deleteSpace(id: string) {
    const existsSpace = await this.manager.findOneBy(SpaceEntity, { id });
    if (!existsSpace) throw new UnprocessableEntityException('Space not found');
    const files = await this.manager.findBy(FileEntity, {
      space_id: existsSpace.id,
    });
    await Promise.all(
      files.map((file) => this.manager.delete(FileEntity, file.id)),
    );
    await this.manager.delete(SpaceEntity, id);
    return { id };
  }

  async getSpacesForUser(): Promise<SpaceEntity[]> {
    return await this.manager.find(SpaceEntity, {
      where: { user_id: this.context.user.id },
    });
  }
}
