import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { format } from 'util';

/**
 * An interceptor that logs incoming requests. Logs the response time
 * asynchronously once the request is finished.
 */
@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();
        const res = http.getResponse<Response>();

        const client = req.ip;
        const method = req.method;
        const route = decodeURIComponent(req.originalUrl);
        const responseStart = Date.now();
        const userAgent = req.get('user-agent') || "''";

        res.on('finish', () => {
            const responseTime = Date.now() - responseStart;
            const status = res.statusCode;
            const contentLength = parseInt(
                res.get('content-length') || '0'
            );

            this.logger.log(
                format(
                    '%s %s - %s %s %d %d - %d ms',
                    client,
                    userAgent,
                    method,
                    route,
                    status,
                    contentLength,
                    responseTime
                )
            );
        });

        return next.handle();
    }
}
