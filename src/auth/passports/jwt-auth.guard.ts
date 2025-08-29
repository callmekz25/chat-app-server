import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, ctx: any) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        code: 'ACCESS_TOKEN_EXPIRED',
        message: 'Token expired',
      });
    }

    return user;
  }
}
