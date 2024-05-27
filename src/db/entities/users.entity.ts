import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID('4')
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column({ type: 'text' })
  readonly login: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column({ type: 'text', unique: true })
  readonly email: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column({ type: 'text' })
  readonly name: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column({ type: 'text' })
  readonly password: string;
}
