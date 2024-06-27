import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    console.log('req:', req.headers.token)
    // console.log('res:', res)
    next()
  }
}
