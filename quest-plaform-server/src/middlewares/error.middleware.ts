import { ENV } from '../config';
import { ErrorsMessages } from '../constants/error_messages';
import { HttpStatusCode } from '../constants/error_code';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  Middleware
} from 'routing-controllers';
import { Service } from 'typedi';

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  public error(
    error: any,
    _req: Request,
    res: Response,
    _next: (err?: any) => any
  ) {
    let statusCode = HttpStatusCode.INTERNAL_SERVER;
    let errorMsg = 'An error occurred';

    if (
      Array.isArray(error.errors) &&
      error.errors.every(element => element instanceof ValidationError)
    ) {
      statusCode = HttpStatusCode.BAD_REQUEST;
      errorMsg = ErrorsMessages.BODY_ERRORS;

      const validationErrors = error.errors
        .map((element: ValidationError) => {
          const constraints = element.constraints || {};
          return Object.values(constraints).map(
            constraint => `Property ${constraint}`
          );
        })
        .flat();

      errorMsg = validationErrors.join(', ');
    } else {
      if (error.httpCode) {
        statusCode = error.httpCode;
      }
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }

      if (ENV === 'dev' && error.stack) {
        console.error(error.stack);
      }
    }

    res.status(statusCode).json({
      code: statusCode,
      data: null,
      msg: errorMsg
    });
  }
}
