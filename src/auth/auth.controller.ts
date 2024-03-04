import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtGuard } from './guard/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}
  @ApiOperation({ summary: 'Регистрация' })
  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.create(dto);
    const token = await this.authService.addTokenToResponse(user.id, res);
    return { ...user, token };
  }
  @ApiOperation({ summary: 'Авторизация' })
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const token = await this.authService.addTokenToResponse(user.id, res);
    return { ...user, token };
  }
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Получение профиля текущего пользователя' })
  @Get('profile')
  async getUser(@Req() req: Request) {
    return await this.authService.getUser(req);
  }
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Выход из аккаунта' })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.removeTokenFromResponse(res);
  }
}
