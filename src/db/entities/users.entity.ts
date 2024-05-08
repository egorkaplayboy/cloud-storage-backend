import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'text' })
  readonly login: string;

  @Column({ type: 'text', unique: true })
  readonly email: string;

  @Column({ type: 'text' })
  readonly name: string;

  @Column({ type: 'text' })
  readonly password: string;
}
