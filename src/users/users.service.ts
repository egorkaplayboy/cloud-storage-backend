import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/db/entities/users.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { MapperUser } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly manager: Repository<UsersEntity>,
  ) {}
  async create(dto: CreateUserDto) {
    const existsUser = await this.manager.findOneBy({ email: dto.email });
    if (existsUser)
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    const user = this.manager.create({
      id: randomUUID(),
      email: dto.email,
      login: dto.login,
      name: dto.name,
      password: await bcrypt.hash(dto.password, 8),
    });
    const savedUser = await this.manager.save(user);
    return MapperUser.toBriefInfo(savedUser);
  }

  async findByEmail(email: string) {
    return await this.manager.findOneBy({ email });
  }
}
