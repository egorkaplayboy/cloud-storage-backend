import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UserBriefInfo } from 'src/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ type: UserBriefInfo })
  @Post('/register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto,
  ) {
    const user = await this.userService.create(dto);
    await this.authService.addTokenToHeaders(res, user);

    return user;
  }

  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({ type: UserBriefInfo })
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginUserDto,
  ) {
    const user = await this.authService.login(dto);
    await this.authService.addTokenToHeaders(res, user);

    return user;
  }

  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({ type: String })
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.removeHeader('Authorization');

    return { message: 'Logout successfully' };
  }
}
