import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Put,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('picture'))
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    createUserDto.picture = file.buffer.toString('base64');
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const errors = await validate(updateUserDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
