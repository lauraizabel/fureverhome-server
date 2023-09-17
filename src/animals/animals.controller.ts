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
  UploadedFiles,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

    const files = req.body.files.map((file) => {
      return {
        base64Image: file.buffer.toString('base64'),
        fileName: file.originalname,
      };
    });

    return this.animalsService.uploadPictures(+id, files);
  }

  @UseGuards(AuthGuard)
  @Post(':id/multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Missing user');
    }

    const newFiles = files.map((file) => {
      return {
        base64Image: file.buffer.toString('base64'),
        fileName: file.originalname,
      };
    });

    return this.animalsService.uploadPictures(+id, newFiles);
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

    return this.animalsService.findByUser(user.sub, pageOptionsDto);
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
