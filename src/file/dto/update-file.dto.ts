import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDTO } from 'src/file/dto/create-file.dto';

export class UpdateFileDTO extends PartialType(CreateFileDTO) {}
