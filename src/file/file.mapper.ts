import { FileBriefInfo } from 'src/dto/file.dto';
import { FileEntity } from 'src/db/entities/file.entity';

export class MapperFile {
  static toBriefInfo(e: FileEntity): FileBriefInfo {
    return {
      id: e.id,
      filename: e.filename,
      originalName: e.originalName,
      mimetype: e.mimetype,
      size: e.size,
      space_id: e.space_id,
      user_id: e.user_id,
    };
  }

  static toBriefInfos(e: FileEntity[]): FileBriefInfo[] {
    return e.map((item) => MapperFile.toBriefInfo(item));
  }
}
