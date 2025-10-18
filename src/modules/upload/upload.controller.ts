import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
    const results = await Promise.all(
      files.map((file) => this.uploadService.uploadFile(file, req.user.sub)),
    );
    console.log(results);

    return results;
  }

  @Delete(':publicId')
  async deleteFile(@Param() publicId: string) {
    return await this.uploadService.deleteFile(publicId);
  }
}
