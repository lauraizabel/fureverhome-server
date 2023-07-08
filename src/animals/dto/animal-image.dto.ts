import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AnimalImagesDto {
  @IsNotEmpty()
  @IsString()
  @IsArray()
  url: string[];
}

export class AnimalImageDto {
  @IsNotEmpty()
  @IsString()
  url: string;
}
