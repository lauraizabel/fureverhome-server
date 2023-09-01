import { IsOptional, IsString } from 'class-validator';

export class UserOptionDto {
  @IsString()
  @IsOptional()
  readonly name?: string = undefined;

  @IsString()
  @IsOptional()
  readonly proximity?: string = undefined;
}
