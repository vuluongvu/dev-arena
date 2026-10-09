import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

// middleware create UUID and assgin to req hashmap
@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // get id from header or generate new one
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();

    // assgin req to interceptor / controller use
    (req as any)['requestId'] = requestId; // req hashmap

    // set id for header to return to client
    res.setHeader('X-Request-Id', requestId);
    next(); // next step
  }
}
