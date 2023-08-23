import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { AnimalSex } from 'src/animals/enum/animal-sex.enum';
import { AnimalSize } from 'src/animals/enum/animal-size.enum';
import { AnimalType } from 'src/animals/enum/animal-type.enum';

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

  @IsOptional()
  @IsNumber()
  readonly radius?: number = undefined;

  @IsEnum(AnimalType)
  @IsOptional()
  readonly type?: AnimalType = undefined;
}
