import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryConfig } from '@/config/cloudinary.config';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'CLOUDINARY',
      useFactory: CloudinaryConfig,
    },
  ],
})
export class UploadModule {}
