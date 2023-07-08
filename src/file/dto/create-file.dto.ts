import { IsString } from 'class-validator';
import { Animal } from 'src/animals/entities/animal.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateFileDTO {
  @IsString()
  url: string;

  @IsString()
  fileId: string;

  user?: User;

  animal?: Animal;
}
