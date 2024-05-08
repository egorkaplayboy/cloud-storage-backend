import { PickType } from '@nestjs/mapped-types';
import { UsersEntity } from 'src/db/entities/users.entity';

export class UserBriefInfo extends PickType(UsersEntity, [
  'id',
  'login',
  'name',
]) {}

export class CreateUserDto extends PickType(UsersEntity, [
  'email',
  'login',
  'name',
  'password',
]) {}

export class LoginUserDto extends PickType(UsersEntity, [
  'password',
  'email',
]) {}
