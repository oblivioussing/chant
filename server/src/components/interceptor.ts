import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException
} from '@nestjs/common'
import { error } from 'console'
import { FastifyRequest, FastifyReply } from 'fastify'
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const request = http.getRequest<FastifyRequest>()
    const response = http.getResponse<FastifyReply>()
    return next.handle().pipe(
      tap((data) => {
        // post默认的201状态码改为200
        if (request.method === 'POST' && response.statusCode === 201) {
          response.statusCode = 200
        }
        return data
      })
    )
  }
}
