import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FileValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const files = req.files as Express.Multer.File[];

    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('Vui lòng tải lên ít nhất một file');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File ${file.originalname} không hợp lệ, chỉ chấp nhận JPEG hoặc PNG`,
        );
      }
      if (file.size > maxSize) {
        throw new BadRequestException(
          `File ${file.originalname} vượt quá giới hạn 10MB`,
        );
      }
    }

    next();
  }
}
