import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FileValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      throw new BadRequestException('Vui lòng tải file lên');
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      throw new BadRequestException(
        'Hình ảnh không hợp lệ, chỉ chấp nhận JPEG hoặc PNG',
      );
    }
    if (req.file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('Hình ảnh không được vượt quá 10MB');
    }
    next();
  }
}
