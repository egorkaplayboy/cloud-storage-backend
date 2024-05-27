import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { SpaceType } from 'src/dto/space.dto';
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'space' })
export class SpaceEntity {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID('4')
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column('text')
  readonly name: string;

  @ApiProperty({ type: String, format: 'uuid' })
  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Column('uuid')
  readonly user_id: string;

  @IsEnum(SpaceType)
  @Column('enum', { default: SpaceType.FREE, enum: SpaceType })
  readonly type: SpaceType;

  // in megabytes
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @Column('int', { default: 2024 })
  readonly totalMemory: number;

  // in megabytes
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @Column('float', { default: 0 })
  readonly usedMemory: number;

  // in megabytes
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @Column('int', { default: 100 })
  readonly maxFileSizeUpload: number;
}
