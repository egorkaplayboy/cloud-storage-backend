import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SpaceEntity } from 'src/db/entities/space.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('space')
@ApiTags('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @ApiOperation({ summary: 'Создать бесплатное пространство' })
  @ApiResponse({ type: SpaceEntity })
  @Post('/create-trial')
  async createTrial(@Body('name') name: string) {
    return await this.spaceService.createTrial(name);
  }

  @ApiOperation({ summary: 'Создать платное пространство' })
  @ApiResponse({ type: SpaceEntity })
  @Post('/create-paid')
  async createPaid(@Body('name') name: string) {
    return await this.spaceService.createPaid(name);
  }

  @ApiOperation({ summary: 'Обновить пространство' })
  @ApiResponse({ type: String })
  @Patch('/update')
  async updateToPaid(@Body('space_id') space_id: string) {
    return await this.spaceService.updateToPaid(space_id);
  }

  @ApiOperation({ summary: 'Удалить пространство и файлы этого простраства' })
  @ApiResponse({ type: String })
  @Delete('/delete')
  async delete(@Body('space_id') space_id: string) {
    return await this.spaceService.deleteSpace(space_id);
  }

  @ApiOperation({ summary: 'Получить все пространства пользователя' })
  @ApiResponse({ type: SpaceEntity, isArray: true })
  @Get('/get-spaces')
  async getSpacesForUser() {
    return await this.spaceService.getSpacesForUser();
  }
}
