import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
import { AuthGuard } from 'src/auth/guard/auth.guard';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileBriefInfo } from 'src/dto/file.dto';

@UseGuards(AuthGuard)
@Controller('file')
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Просмотреть файл по id' })
  @ApiResponse({ type: StreamableFile })
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

  @ApiOperation({ summary: 'Скачать файл по id' })
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

  @ApiOperation({ summary: 'Загрузить файлы' })
  @ApiResponse({ type: FileBriefInfo, isArray: true })
  @Post('/upload-many')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  async uploadManyFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('space_id') space_id: string,
  ) {
    const uploadedFiles = await Promise.all(
      files.map((file) => {
        return this.fileService.uploadFile(file, space_id);
      }),
    );
    return uploadedFiles;
  }

  @ApiOperation({ summary: 'Получить файлы по space id' })
  @ApiResponse({ type: FileBriefInfo, isArray: true })
  @Get('/:id/get-files')
  async getFilesForSpace(@Param('id') space_id: string) {
    return await this.fileService.getFilesForSpace(space_id);
  }

  @ApiOperation({ summary: 'Удалить файл' })
  @ApiResponse({ type: String })
  @Delete(':id/delete')
  async deleteFile(@Param('file_id') file_id: string) {
    return await this.fileService.deleteFile(file_id);
  }
}
