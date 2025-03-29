import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

interface MulterFile {
  buffer: Buffer;
}
@Injectable()
export class CloudinaryService {
  uploadFile(file: MulterFile): Promise<string> {
    if (!file?.buffer) {
      return Promise.reject(new Error('Invalid file buffer'));
    }
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error || !result?.secure_url) {
            return reject(new Error(error?.message || 'Upload failed'));
          }
          resolve(result.secure_url);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
