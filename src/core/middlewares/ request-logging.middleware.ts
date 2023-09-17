import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLoggingMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    if (req.body) {
      this.logger.log(`[${method}] ${url} ${JSON.stringify(req.body)}`);
    } else if (req.params) {
      this.logger.log(`[${method}] ${url} ${JSON.stringify(req.params)}`);
    } else if (req.query) {
      this.logger.log(`[${method}] ${url} ${JSON.stringify(req.query)}`);
    } else {
      this.logger.log(`[${method}] ${url}`);
    }

    next();
  }
}
