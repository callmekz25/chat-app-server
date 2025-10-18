import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs/promises';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private detectFileType(
    mime: string,
  ): 'image' | 'video' | 'audio' | 'document' {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    return 'document';
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const type = this.detectFileType(file.mimetype);
      const folder = `chat/${userId}/${type}`;
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          },
        );

        Readable.from(file.buffer).pipe(upload);
      });
      const baseResponse = {
        url: result.secure_url,
        publicId: result.public_id,
        type,
      };
      if (result.resource_type === 'raw' || type === 'document') {
        baseResponse['fileName'] = file.originalname;
        baseResponse['fileSize'] = result.bytes;
        baseResponse['fileFormat'] = result.format;
      }
      return baseResponse;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      await fs.unlink(file.path).catch((err) => {
        console.error(err);
      });
      throw error;
    }
  }

  async deleteFile(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
}
