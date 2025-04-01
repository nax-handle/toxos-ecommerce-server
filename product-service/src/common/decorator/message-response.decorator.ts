import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/response.interceptor';

export function MessageResponse(message?: string) {
  return applyDecorators(UseInterceptors(new ResponseInterceptor(message)));
}
