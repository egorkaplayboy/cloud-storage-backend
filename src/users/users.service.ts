import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
  ) {}
  async findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }
  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }
  async create(dto: CreateUserDto) {
    const existUser = await this.repository.findOne({
      where: { email: dto.email },
    });
    if (existUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.repository.save({
      email: dto.email,
      password: await bcrypt.hash(dto.password, 7),
      username: dto.username,
    });
    return user;
  }
}
