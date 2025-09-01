import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();
    const user = request.user as any;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    // Log the error
    this.logger.error({
      message: 'Unhandled exception',
      path: request.url,
      method: request.method,
      statusCode: status,
      error: message,
      stack: stack,
      userId: user?.userId || 'anonymous',
      timestamp: new Date().toISOString(),
    });

    // Don't send stack trace in production
    const isProduction = process.env.NODE_ENV === 'production';
    const responseBody = {
      statusCode: status,
      message: isProduction && status >= 500 ? 'Internal server error' : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }
}
