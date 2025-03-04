// import { Injectable } from '@nestjs/common';
// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
// import { Express } from 'express';
// import { Multer } from 'multer';

// @Injectable()
// export class UploadService {
//   async uploadImages(files: Multer.File[]): Promise<string[]> {
//     const uploadPromises = files.map((file) => this.uploadToCloudinary(file));
//     const results = await Promise.all(uploadPromises);
//     return results.map((result) => result.secure_url);
//   }

//   private async uploadToCloudinary(
//     file: Multer.File,
//   ): Promise<UploadApiResponse> {
//     const multerFile = file as Multer.File;
//     if (!multerFile || !multerFile.mimetype || !multerFile.buffer) {
//       throw new Error('Invalid file');
//     }
//     return cloudinary.uploader.upload(
//       `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
//       {
//         resource_type: 'auto',
//       },
//     );
//   }
// }
