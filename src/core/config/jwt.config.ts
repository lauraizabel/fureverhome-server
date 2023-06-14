import { environment } from 'src/core/consts/environment.const';

export const jwtConfig = {
  global: true,
  secret: environment.jwt.secret,
  signOptions: { expiresIn: '1d' },
};
