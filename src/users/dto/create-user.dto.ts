import {
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
  IsString,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import {
  ErrorsMessages,
  MAX_LENGTH_NAME,
  MIN_LENGTH_NAME,
  MIN_LENGTH_PASSWORD,
  REGEX_CNPJ,
} from 'src/core/consts/errors-content.const';
import { UserType } from 'src/users/enum/user-type.enum';
import { AnimalType } from '../../animals/enum/animal-type.enum';

export class CreateUserDto {
  @IsString({ message: ErrorsMessages.name.alphanumeric })
  @MaxLength(MAX_LENGTH_NAME, { message: ErrorsMessages.name.maxLength })
  @MinLength(MIN_LENGTH_NAME, { message: ErrorsMessages.name.minLength })
  @IsNotEmpty({ message: ErrorsMessages.name.required })
  firstName: string;

  @IsString({ message: ErrorsMessages.name.alphanumeric })
  @MaxLength(MAX_LENGTH_NAME, { message: ErrorsMessages.name.maxLength })
  @MinLength(MIN_LENGTH_NAME, { message: ErrorsMessages.name.minLength })
  lastName: string;

  password: string;

  @IsEmail()
  @IsNotEmpty({ message: ErrorsMessages.email.required })
  email: string;

  @IsString()
  @IsOptional()
  job: string;

  @IsString()
  @IsOptional()
  cpf: string;

  @IsString()
  @IsOptional()
  @Matches(REGEX_CNPJ)
  cnpj: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(AnimalType, { each: true })
  @IsArray()
  @IsOptional()
  animalTypes: AnimalType[];

  @IsString()
  @IsOptional()
  phone: string;

  @IsEnum(UserType)
  type: UserType;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsOptional()
  @IsString()
  number?: string;
}
