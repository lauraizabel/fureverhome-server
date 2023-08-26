import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  BadRequestException,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Query,
  Put,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { PageOptionsDto } from 'src/core/dto/page-options.dto';
import { QueryInterface } from 'src/core/interfaces/query.interface';

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

    return this.animalsService.create(createAnimalDto, user.sub);
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
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    const newFile = file
      ? file.buffer.toString('base64')
      : req.body.file.base64;

    const newName = file ? file.originalname : req.body.file.name;

    const obj = {
      base64Image: newFile,
      fileName: newName,
    };

    return this.animalsService.uploadPicture(+id, obj);
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
  findAll(@Query() query: QueryInterface, @Request() req) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    const userId = user ? user.sub : null;

    return this.animalsService.findAll(query, +userId);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  findByUser(
    @Request() req,
    @Param('id') id: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.findByUser(+id, pageOptionsDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnimalDto: UpdateAnimalDto,
    @Request() req,
  ) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.update(+id, updateAnimalDto, user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    return this.animalsService.remove(+id, user.sub);
  }
}
