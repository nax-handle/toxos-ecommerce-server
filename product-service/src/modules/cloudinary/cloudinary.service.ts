import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

import { CloudinaryConfig } from '../../configs/cloudinary.config';

console.log(CloudinaryConfig);
interface MulterFile {
  buffer: Buffer;
}

@Injectable()
export class CloudinaryService {
  uploadFile(file: MulterFile): Promise<UploadApiResponse> {
    if (!file?.buffer) {
      return Promise.reject(new Error('Invalid file buffer'));
    }

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error: Error | null, result: UploadApiResponse) => {
          if (error) return reject(new Error(error.message || 'Upload failed'));
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    console.log('Received files:', files);

    if (!files?.length) {
      console.log('No files received!');
      return [];
    }
    const validFiles = files.filter((file) => file?.buffer);
    console.log('Valid files for upload:', validFiles);

    if (!validFiles.length) {
      console.log('No valid files with buffer found!');
      return [];
    }

    const data = await Promise.all(
      validFiles.map((file) => this.uploadFile(file)),
    );

    return data.map((item: UploadApiResponse) => item.secure_url);
  }
}
