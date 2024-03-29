import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Пароль' })
  @IsString()
  @MinLength(6, { message: 'password minimum length should be 6 symbols' })
  password: string;
  @ApiProperty({ example: 'Jhon', description: 'Имя пользователя' })
  @MinLength(4, { message: 'username minimum length should by a 4 symbols' })
  username: string;
}
