import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    const API_KEY = this.configService.get<string>('API_KEY');
    if (!apiKey) throw new BadRequestException('Oops!');
    if (apiKey !== API_KEY) throw new BadRequestException('Oops!');
    next();
  }
}
