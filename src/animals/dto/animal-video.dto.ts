import { IsArray, IsNotEmpty } from 'class-validator';
import { IsFileFormat } from 'src/animals/dto/validator/file.validator';

export class AnimalVideosDto {
  @IsNotEmpty()
  @IsFileFormat(['mp4', 'mov'])
  @IsArray()
  url: string[];
}

export class AnimalVideoDto {
  @IsNotEmpty()
  @IsFileFormat(['mp4', 'mov'])
  url: string;
}
