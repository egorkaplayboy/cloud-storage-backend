import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { AuthGuard, CustomRequest } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post('/create-trial')
  async createTrial(@Req() req: CustomRequest, @Body('name') name: string) {
    return await this.spaceService.createTrial(name, req.user.id);
  }

  @Post('/create-paid')
  async createPaid(@Req() req: CustomRequest, @Body('name') name: string) {
    return await this.spaceService.createPaid(name, req.user.id);
  }

  @Patch('/update')
  async updateToPaid(@Body('space_id') space_id: string) {
    return await this.spaceService.updateToPaid(space_id);
  }

  @Delete('/delete')
  async delete(@Body('space_id') space_id: string) {
    return await this.spaceService.deleteSpace(space_id);
  }

  @Get('/get-spaces')
  async getSpacesForUser(@Req() req: CustomRequest) {
    return await this.spaceService.getSpacesForUser(req.user.id);
  }
}
