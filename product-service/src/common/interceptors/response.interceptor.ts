import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseFormat<T> {
  message?: string;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  constructor(private readonly message?: string) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;
        let message: string;

        if (data && typeof data === 'object' && 'data' in data) {
          const responseData = data as ResponseFormat<T>;
          message = this.message || responseData.message || 'Success';
        } else {
          message = this.message || 'Success';
        }

        return {
          statusCode,
          success: true,
          message,
          data: data,
        };
      }),
    );
  }
}
