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

export class CreateAnimalDto {
  @IsEnum(AnimalType)
  @IsNotEmpty()
  type: AnimalType;

  @IsEnum(CommonColors)
  @IsNotEmpty()
  color: CommonColors;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsEnum(AnimalDewormed)
  @IsNotEmpty()
  dewormed: AnimalDewormed;

  @IsOptional()
  user?: User;
}
