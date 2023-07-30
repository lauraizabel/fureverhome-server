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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/core/decorator/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

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
  @UseGuards(AuthGuard)
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
    const fileName = file.filename || file.originalname;
    return this.usersService.uploadPicture(+id, buffer, fileName);
  }

  @Delete(':id/image/:imageId')
  @UseGuards(AuthGuard)
  async deletePicture(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.usersService.deletePicture(+id, imageId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('ongs')
  findAllOngs() {
    return this.usersService.getAllOngs();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const errors = await validate(updateUserDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
