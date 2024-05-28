import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { MapperUser } from './user.mapper';
import { BaseService } from 'src/base/base.service';
import { UsersEntity } from 'src/db/entities/users.entity';

@Injectable()
export class UsersService extends BaseService {
  async create(dto: CreateUserDto) {
    const existsUser = await this.manager.findOneBy(UsersEntity, {
      email: dto.email,
    });
    if (existsUser)
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    const user = this.manager.create(UsersEntity, {
      id: randomUUID(),
      email: dto.email,
      login: dto.login,
      name: dto.name,
      password: await bcrypt.hash(dto.password, 8),
    });
    const savedUser = await this.manager.save(UsersEntity, user);
    return MapperUser.toBriefInfo(savedUser);
  }

  async findByEmail(email: string) {
    return await this.manager.findOneBy(UsersEntity, { email });
  }
}
