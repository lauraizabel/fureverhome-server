export const REGEX_CPF =
  '([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})';

export const REGEX_CNPJ =
  'd{2}.?d{3}.?d{3}/?d{4}-?d{2}\
';
export const MAX_LENGTH_NAME = 20;
export const MIN_LENGTH_NAME = 3;
export const MIN_LENGTH_PASSWORD = 3;

export const ErrorsMessages = {
  email: {
    required: 'O email é obrigatório',
    invalid: 'Insira um email válido',
  },
  password: {
    required: 'A senha é obrigatória',
    minLength: `A senha deve ter no mínimo ${MIN_LENGTH_PASSWORD} caracteres`,
  },
  name: {
    required: 'O nome é obrigatório',
    minLength: `A senha deve ter no mínimo ${MIN_LENGTH_NAME} caracteres`,
    maxLength: `A senha deve ter no máximo ${MAX_LENGTH_NAME} caracteres`,
    alphanumeric: 'O nome deve conter apenas letras e números',
  },
  phoneNumber: {
    required: 'O número de telefone é obrigatório',
    invalid: 'Insira um número de telefone válido',
  },
  address: {
    required: 'O endereço é obrigatório',
    maxLength: 'O endereço deve ter no máximo X caracteres',
  },
  dateOfBirth: {
    required: 'A data de nascimento é obrigatória',
    invalid: 'Insira uma data de nascimento válida',
  },
  cpf: {
    invalid: 'Insira um CPF válido',
  },
};
