import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, UserBriefInfo } from 'src/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MapperUser } from 'src/users/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    return MapperUser.toBriefInfo(user);
  }

  async addTokenToHeaders(@Res() res: Response, user: UserBriefInfo) {
    const token = this.jwtService.sign(user);
    res.setHeader('Authorization', `Bearer ${token}`);
  }
}
