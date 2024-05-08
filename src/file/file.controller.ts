import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Response } from 'express';
import { AuthGuard, CustomRequest } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/:id')
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    const file = await this.fileService.getFileById(id);
    const stream = Readable.from(file.data);

    res.set({
      'Content-Disposition': `inline; filename="${encodeURIComponent(file.originalName)}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
  }

  @Get('/:id/download')
  async downloadFile(@Res() res: Response, @Param('id') id: string) {
    const file = await this.fileService.getFileById(id);
    const stream = Readable.from(file.data);

    res.set({
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
      'Content-Type': `${file.mimetype}`,
    });

    stream.pipe(res);
  }

  @Post('/upload-many')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadManyFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('space_id') space_id: string,
    @Req() req: CustomRequest,
  ) {
    const uploadedFiles = await Promise.all(
      files.map((file) => {
        return this.fileService.uploadFile(file, req.user.id, space_id);
      }),
    );
    return uploadedFiles;
  }

  @Get('/:id/get-files')
  async getFilesForSpace(
    @Param('id') space_id: string,
    @Req() req: CustomRequest,
  ) {
    return await this.fileService.getFilesForSpace(space_id, req.user.id);
  }
}
