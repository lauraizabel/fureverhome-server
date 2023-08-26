import { AnimalOptionDto } from 'src/core/dto/animal-options.dto';
import { PageOptionsDto } from 'src/core/dto/page-options.dto';
import { UserOptionDto } from 'src/users/dto/user-options.dto';

export type QueryInterface = PageOptionsDto & AnimalOptionDto & UserOptionDto;
