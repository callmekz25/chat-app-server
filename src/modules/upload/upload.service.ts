import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs/promises';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File, type: string, userId: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const folder = `chat/${userId}/${type}`;
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          },
        );

        Readable.from(file.buffer).pipe(upload);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        type: type,
      };
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
