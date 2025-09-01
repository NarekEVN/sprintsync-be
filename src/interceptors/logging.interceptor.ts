import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl, user } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip || '';

    const now = Date.now();
    const userId = user?.['userId'] || 'anonymous';

    this.logger.log({
      message: 'Request started',
      method,
      path: originalUrl,
      userId,
      userAgent,
      ip,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const contentLength = response.get('content-length') || 0;
          const latency = Date.now() - now;

          this.logger.log({
            message: 'Request completed',
            method,
            path: originalUrl,
            statusCode,
            contentLength,
            latency: `${latency}ms`,
            userId,
          });
        },
        error: (error) => {
          const latency = Date.now() - now;

          this.logger.error({
            message: 'Request failed',
            method,
            path: originalUrl,
            error: error.message,
            stack: error.stack,
            latency: `${latency}ms`,
            userId,
          });
        },
      }),
    );
  }
}
