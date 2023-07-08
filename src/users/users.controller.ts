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
import { Public } from 'src/core/decorator/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.usersService.create(createUserDto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('picture'))
  async uploadPicture(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const buffer = file.buffer.toString('base64');
    const fileName = file.filename;
    return this.usersService.uploadPicture(+id, buffer, fileName);
  }

  @Delete(':id/image/:imageId')
  async deletePicture(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.usersService.deletePicture(+id, imageId);
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
