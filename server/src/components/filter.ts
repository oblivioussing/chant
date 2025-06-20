import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Result } from '@/share'
import { base, logger } from '@/utils'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp()
    const response = http.getResponse<FastifyReply>()
    const request = http.getRequest()
    const headers = request.headers
    const userId = base.getUserIdByToken(headers.token)
    const body = request.body && JSON.stringify(request.body)
    const result = new Result()
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      if (status === 400) {
        const message = exceptionResponse['message']
        result.code = '4'
        result.msg = Array.isArray(message) ? message[0] : message
      }
    } else {
      result.code = '5'
      result.msg = exception?.message
    }
    let content = `\n`
    content += `url:${request.url}\n`
    content += `userId:${userId}\n`
    if (body) {
      content += `body:${body}\n`
    }
    content += `message:${result.msg}\n`
    logger.error(content)
    console.log(exception)
    response.status(200).send(result)
  }
}
