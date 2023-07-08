import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'fileFormat', async: false })
export class FileFormatValidator implements ValidatorConstraintInterface {
  constructor(private allowedFormats: string[]) {}

  validate(value: any, args: ValidationArguments) {
    if (value) {
      const fileFormat = value.split('.').pop();
      return this.allowedFormats.includes(fileFormat);
    }
    return true; // Se o valor não estiver definido, consideramos válido
  }

  defaultMessage(args: ValidationArguments) {
    return `O arquivo deve estar em um dos seguintes formatos: ${this.allowedFormats.join(
      ', ',
    )}`;
  }
}

export function IsFileFormat(
  allowedFormats: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFileFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: new FileFormatValidator(allowedFormats),
    });
  };
}
