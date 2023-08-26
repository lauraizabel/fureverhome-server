import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AnimalType } from 'src/animals/enum/animal-type.enum';
import { CommonColors } from 'src/animals/enum/animal-colors.enum';
import { AnimalDewormed } from 'src/animals/enum/animal-dewormed.enum';
import { User } from 'src/users/entities/user.entity';
import { AnimalSize } from '../enum/animal-size.enum';
import { AnimalCastrated } from '../enum/animal-castrated.enum';
import { AnimalSex } from 'src/animals/enum/animal-sex.enum';
import { AnimalAge } from 'src/animals/enum/animal-age.enum';

export class CreateAnimalDto {
  @IsEnum(AnimalType)
  @IsNotEmpty()
  type: AnimalType;

  @IsEnum(CommonColors)
  @IsNotEmpty()
  color: CommonColors;

  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  description: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsEnum(AnimalDewormed)
  @IsNotEmpty()
  dewormed: AnimalDewormed;

  @IsEnum(AnimalSize)
  @IsNotEmpty()
  size: AnimalSize;

  @IsEnum(AnimalCastrated)
  @IsNotEmpty()
  castrated: AnimalCastrated;

  @IsEnum(AnimalSex)
  @IsNotEmpty()
  sex: AnimalSex;

  @IsNotEmpty()
  @IsEnum(AnimalAge)
  age: AnimalAge;

  @IsOptional()
  user?: User;
}
