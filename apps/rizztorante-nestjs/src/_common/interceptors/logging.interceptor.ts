import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    const method = request.method;

    return next
      .handle()
      .pipe(tap(() => console.log(`Execution time ${method} ${url}: ${Date.now() - now}ms`)));
  }
}
