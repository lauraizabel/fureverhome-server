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
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto, @Request() req) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.create(createAnimalDto);
  }

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

  @Post(':id/files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImage(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    const files_ = files.map(({ filename, buffer }) => ({
      fileName: filename,
      base64Image: buffer.toString('base64'),
    }));

    return this.animalsService.uploadPicture(+id, files_);
  }

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

  @Get()
  findAll() {
    return this.animalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(+id);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.remove(+id, user.id);
  }
}
