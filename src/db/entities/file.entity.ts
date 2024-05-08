import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpaceEntity } from './space.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'files' })
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column('text')
  readonly filename: string;

  @Column('text')
  readonly originalName: string;

  @Column('text')
  readonly mimetype: string;

  // in megabytes
  @Column('float')
  readonly size: number;

  @Column({
    type: 'bytea',
  })
  readonly data: Buffer;

  @ManyToOne(() => SpaceEntity, (space) => space.id)
  @JoinColumn({ name: 'space_id' })
  readonly space_id: string;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  readonly user_id: string;
}
