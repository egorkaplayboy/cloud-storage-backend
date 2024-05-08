import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { SpaceType } from 'src/dto/space.dto';

@Entity({ name: 'space' })
export class SpaceEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column('text')
  readonly name: string;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  readonly user_id: string;

  @Column('enum', { default: SpaceType.FREE, enum: SpaceType })
  readonly type: SpaceType;

  // in megabytes
  @Column('int', { default: 2024 })
  readonly totalMemory: number;

  // in megabytes
  @Column('float', { default: 0 })
  readonly usedMemory: number;

  // in megabytes
  @Column('int', { default: 100 })
  readonly maxFileSizeUpload: number;
}
