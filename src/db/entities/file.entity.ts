import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpaceEntity } from './space.entity';
import { UsersEntity } from './users.entity';
import { IsNumber, IsPositive, IsString, IsUUID, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'files' })
export class FileEntity {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID('4')
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column('text')
  readonly filename: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column('text')
  readonly originalName: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column('text')
  readonly mimetype: string;

  // in megabytes

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @Max(10 * 1024)
  @Column('float')
  readonly size: number;

  @ApiProperty({ type: Buffer })
  @Column({
    type: 'bytea',
  })
  readonly data: Buffer;

  @ApiProperty({ type: String, format: 'uuid' })
  @ManyToOne(() => SpaceEntity, (space) => space.id)
  @JoinColumn({ name: 'space_id' })
  @Column('uuid')
  readonly space_id: string;

  @ApiProperty({ type: String, format: 'uuid' })
  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Column('uuid')
  readonly user_id: string;
}
