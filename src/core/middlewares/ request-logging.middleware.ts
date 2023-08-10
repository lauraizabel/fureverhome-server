import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLoggingMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    this.logger.log(`[${method}] ${url}`);
    next();
  }
}
