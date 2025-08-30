import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        const message = data?.message ?? 'Thành công';
        const payload = data?.data ?? data;

        return {
          statusCode: response.statusCode ?? 200,
          success: true,
          message,
          data: payload,
        };
      }),
    );
  }
}
