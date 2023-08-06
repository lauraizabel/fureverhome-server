import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { AnimalSex } from 'src/animals/enum/animal-sex.enum';
import { AnimalSize } from 'src/animals/enum/animal-size.enum';

export class AnimalOptionDto {
  @IsEnum(AnimalSize)
  @IsOptional()
  readonly size?: AnimalSize = undefined;

  @IsOptional()
  @Min(1)
  @IsInt()
  readonly minAge?: number = 1;

  @IsOptional()
  @IsInt()
  readonly maxAge?: number = undefined;

  @IsOptional()
  @IsEnum(AnimalSex)
  readonly sex?: AnimalSex = undefined;
}
