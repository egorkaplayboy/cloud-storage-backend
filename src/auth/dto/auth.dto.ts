import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Пароль' })
  @IsString()
  @MinLength(6, { message: 'password minimum length should be 6 symbols' })
  password: string;
}
