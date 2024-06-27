import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const request = http.getRequest()
    const response = http.getResponse()

    return next.handle().pipe(
      map((data) => {
        // post默认的201状态码改为200
        if (request.method === 'POST' && response.statusCode === 201) {
          response.statusCode = 200
        }
        return data
      })
    )
  }
}
