import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { base, logger } from '@/utils'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const request = http.getRequest<FastifyRequest>()
    const response = http.getResponse<FastifyReply>()
    const headers = request.headers as any
    const uid = base.getUidByToken(headers.token)
    const body = request.body && JSON.stringify(request.body)
    let content = `\n`
    content += `url:${request.url}\n`
    content += `uid:${uid}\n`
    if (body) {
      content += `body:${body}\n`
    }
    return next.handle().pipe(
      tap((data) => {
        if (data) {
          content += `code:${data.code}\n`
          content += `msg:${data.msg}\n`
          logger.info(content)
        }
        // post默认的201状态码改为200
        if (request.method === 'POST' && response.statusCode === 201) {
          response.statusCode = 200
        }
        return data
      })
    )
  }
}
