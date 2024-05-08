import { OmitType } from '@nestjs/mapped-types';
import { FileEntity } from 'src/db/entities/file.entity';

export class FileBriefInfo extends OmitType(FileEntity, ['data']) {}
