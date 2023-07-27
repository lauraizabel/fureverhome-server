import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto, @Request() req) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.create(createAnimalDto);
  }

  @UseGuards(AuthGuard)
  @Post(':id/video')
  uploadVideo(
    @Param('id') id: string,
    @Body() updateAnimalDto: UpdateAnimalDto,
    @Request() req,
  ) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.update(+id, updateAnimalDto, user.id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImage(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ) {
    const user = req.user;
    console.log({ req });
    if (!user) {
      throw new BadRequestException('Missing user');
    }

    const files_ = files.map(({ filename, buffer, originalname }) => ({
      fileName: filename || originalname,
      base64Image: buffer.toString('base64'),
    }));

    return this.animalsService.uploadPicture(+id, files_);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/file/:imageId')
  deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @Request() req,
  ) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.deletePicture(+id, imageId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.animalsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  findByUser(@Request() req, @Param('id') id: string) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.findByUser(+id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnimalDto: UpdateAnimalDto,
    @Request() req,
  ) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.update(+id, updateAnimalDto, user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.remove(+id, user.id);
  }
}
