import { LoggingMiddleware } from './logging.middleware';
import { ErrorMiddleware } from './error.middleware';

export const middlewares = [LoggingMiddleware, ErrorMiddleware];
