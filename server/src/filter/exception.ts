import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Result } from '@/share'
import { base, logger } from '@/utils'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest()
    const headers = request.headers
    const uid = base.getUidByToken(headers.token)
    const body = request.body && JSON.stringify(request.body)
    const content = `
url:${request.url}
uid:${uid}
body:${body}
message:${exception?.message}
`
    logger.error(content)
    console.error(exception?.message)
    const result = new Result()
    result.code = '5'
    result.msg = exception?.message
    response.status(200).send(result)
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const result = new Result()
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    if (status === 400) {
      const message = exceptionResponse['message']
      result.code = '4'
      result.msg = Array.isArray(message) ? message[0] : message
      response.status(200).send(result)
    } else {
      response.status(status).send(exceptionResponse)
    }
  }
}
