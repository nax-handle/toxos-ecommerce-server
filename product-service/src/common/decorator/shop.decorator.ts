import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ShopId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const shopId = request.headers['x-shop-id'] as string | undefined;
    return typeof shopId === 'string' ? shopId : null;
  },
);
