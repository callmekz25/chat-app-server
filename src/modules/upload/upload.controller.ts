import {
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Query() type: string,
  ) {
    console.log(file);
    console.log(type);
  }

  @Delete(':publicId')
  async deleteFile(@Param() publicId: string) {
    return await this.uploadService.deleteFile(publicId);
  }
}
