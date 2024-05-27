import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CustomRequest } from 'src/auth/guard/auth.guard';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();
    return request.user;
  },
);
