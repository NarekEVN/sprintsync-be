import { Logger } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logDir = path.join(process.cwd(), 'logs');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'sprintsync-be' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const context = meta.context || 'Application';
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : '';
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-base-to-string
          return `[${timestamp}] ${level}: [${context}] ${message}${metaStr}`;
        }),
      ),
    }),
    // File transport for non-test environments
    ...(process.env.NODE_ENV !== 'test'
      ? [
          new winston.transports.DailyRotateFile({
            dirname: logDir,
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
          }),
        ]
      : []),
  ],
  exitOnError: false,
});

Logger.overrideLogger({
  log: (message: string, context?: string) => {
    logger.info(message, { context });
  },
  error: (message: string, trace: string, context?: string) => {
    logger.error(message, { context, trace });
  },
  warn: (message: string, context?: string) => {
    logger.warn(message, { context });
  },
  debug: (message: string, context?: string) => {
    logger.debug(message, { context });
  },
  verbose: (message: string, context?: string) => {
    logger.verbose(message, { context });
  },
});

export { logger };
