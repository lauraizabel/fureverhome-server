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
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/core/decorator/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { PageOptionsDto } from 'src/core/dto/page-options.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Request() req) {
    const createUserDto = req.body;
    // const errors = await validate(createUserDto);
    // if (errors.length > 0) {
    //   throw new BadRequestException({ errors, createUserDto });
    // }

    return this.usersService.create(createUserDto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('picture'))
  async uploadPicture(
    @Param('id') id: string,
    @UploadedFile()
    picture: Express.Multer.File,
    @Request() req,
  ) {
    const newFile = picture
      ? picture.buffer.toString('base64')
      : req.body.file.base64;

    const newName = picture ? picture.originalname : req.body.file.name;

    return this.usersService.uploadPicture(+id, newFile, newName);
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
  findAllOngs(@Query() pageOptionsDto: PageOptionsDto, @Request() req) {
    const user = req.user;
    if (!user) {
      throw new BadRequestException('Missing user');
    }
    const userId = user.sub;
    return this.usersService.getAllOngs(pageOptionsDto, +userId);
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

  @UseGuards(AuthGuard)
  @Put(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
    @Body('newPasswordConfirmation') newPasswordConfirmation: string,
    @Body('currentPassword') currentPassword: string,
  ) {
    if (newPassword !== newPasswordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.usersService.changePassword(+id, currentPassword, newPassword);
  }
}
