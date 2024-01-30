import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ApiCode } from '@/enum'
import { Result } from '@/share'
import { base } from '@/utils'
import { RedisService } from '@/module/redis/service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 是否需要校验权限
    const isAuth = this.reflector.get<boolean>('isAuth', context.getHandler())
    if (isAuth === false) {
      return true
    }
    const http = context.switchToHttp()
    const request = http.getRequest()
    const response = http.getResponse()
    // result
    const result = new Result()
    // token
    const token = request.headers.token
    if (!token) {
      result.code = ApiCode.AuthFailed
      result.msg = '请先登陆'
      response.status(200).send(result)
      return false
    }
    const uid = base.getUidByToken(token)
    if (!uid) {
      result.code = ApiCode.AuthFailed
      result.msg = '权限校验失败,请重新登陆'
      response.status(200).send(result)
      return false
    }
    const value = await this.redisService.get('token', uid)
    if (token === value) {
      // 重置token过期时间
      this.redisService.expire('token', uid, 60 * 60 * 24 * 30)
    } else {
      result.code = ApiCode.AuthFailed
      result.msg = '登陆失效,请重新登陆'
      response.status(200).send(result)
      return false
    }
    return true
  }
}
