import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userId = request.headers['x-user-id'] as string | undefined;
    return typeof userId === 'string' ? userId : null;
  },
);
