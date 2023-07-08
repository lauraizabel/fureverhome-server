import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import {
  ErrorsMessages,
  MAX_LENGTH_NAME,
  MIN_LENGTH_NAME,
  MIN_LENGTH_PASSWORD,
  REGEX_CNPJ,
  REGEX_CPF,
} from 'src/core/consts/errors-content.const';
import { UserAddress } from 'src/users/entities/user-address.entity';
import { UserType } from 'src/users/enum/user-type.enum';

export class CreateUserDto extends UserAddress {
  @IsString({ message: ErrorsMessages.name.alphanumeric })
  @MaxLength(MAX_LENGTH_NAME, { message: ErrorsMessages.name.maxLength })
  @MinLength(MIN_LENGTH_NAME, { message: ErrorsMessages.name.minLength })
  @IsNotEmpty({ message: ErrorsMessages.name.required })
  firstName: string;

  @IsString({ message: ErrorsMessages.name.alphanumeric })
  @MaxLength(MAX_LENGTH_NAME, { message: ErrorsMessages.name.maxLength })
  @MinLength(MIN_LENGTH_NAME, { message: ErrorsMessages.name.minLength })
  @IsNotEmpty({ message: ErrorsMessages.name.required })
  lastName: string;

  @MinLength(MIN_LENGTH_PASSWORD, {
    message: ErrorsMessages.password.minLength,
  })
  @IsNotEmpty({ message: ErrorsMessages.password.required })
  password: string;

  @IsEmail()
  @IsNotEmpty({ message: ErrorsMessages.email.required })
  email: string;

  @IsString()
  @IsOptional()
  job: string;

  @IsString()
  @IsOptional()
  @Matches(REGEX_CPF)
  cpf: string;

  @IsString()
  @IsOptional()
  @Matches(REGEX_CNPJ)
  cnpj: string;

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
