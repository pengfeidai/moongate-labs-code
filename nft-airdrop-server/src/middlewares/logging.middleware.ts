import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import morgan from 'morgan';
import { Service } from 'typedi';

@Middleware({ type: 'before' })
@Service()
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any) {
    morgan('dev')(request, response, next);
  }
}
