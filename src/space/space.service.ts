import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { SpaceType } from 'src/dto/space.dto';
import { SpaceEntity } from 'src/db/entities/space.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(SpaceEntity)
    private readonly manager: Repository<SpaceEntity>,
  ) {}
  async createTrial(name: string, userId: string) {
    const space = this.manager.create({
      id: randomUUID(),
      name,
      user_id: userId,
    });
    await this.manager.save(space);
    return space;
  }

  async createPaid(name: string, userId: string) {
    const space = this.manager.create({
      id: randomUUID(),
      name,
      user_id: userId,
      type: SpaceType.PAID,
      totalMemory: 1024 * 1024,
      maxFileSizeUpload: 10 * 1024,
    });
    await this.manager.save(space);
    return space;
  }

  async updateToPaid(id: string) {
    const existsSpace = await this.manager.findOneBy({ id });
    if (!existsSpace) throw new UnprocessableEntityException('Space not found');
    if (existsSpace.type === SpaceType.PAID)
      throw new Error('Space already paid');
    await this.manager.update(
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
    const existsSpace = await this.manager.findOneBy({ id });
    if (!existsSpace) throw new UnprocessableEntityException('Space not found');
    await this.manager.delete({ id });
    return { id };
  }

  async getSpacesForUser(user_id: string): Promise<SpaceEntity[]> {
    const query = `select * from space where user_id = $1`;
    return await this.manager.query(query, [user_id]);
  }
}
