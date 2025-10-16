import {
  BadRequestException,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs/promises';
@Injectable()
export class UploadService {
  private readonly uploadFolders = {
    IMAGE: 'images',
    VOICE: 'voices',
    FILE: 'files',
  };
  async uploadFile(file: Express.Multer.File, type: string, userId: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!this.uploadFolders[type]) {
      throw new UnsupportedMediaTypeException(`Invalid upload type: ${type}`);
    }
    try {
      const folder = `chat/${userId}/${this.uploadFolders[type]}`;
      const result = await cloudinary.uploader.upload(file.path, { folder });
      await fs.unlink(file.path).catch((err) => {
        console.error(err);
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
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
