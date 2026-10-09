import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
// write log response/ request
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    // print request ID and mesure API time

    console.log(`Request ID: ${req.requestId}`); // start
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`Time Response: ${Date.now() - now} mil`))); // end
  }
}
