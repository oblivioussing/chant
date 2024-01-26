import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata
} from '@nestjs/common'
import { core } from '@/utils'

// 是否需要校验权限
export const Auth = (isAuth: boolean) => SetMetadata('isAuth', isAuth)

// 获取query参数根据model
export const QueryModel = createParamDecorator(
  (entity: object, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query
    for (const item in query) {
      if (query[item] === '') {
        Reflect.deleteProperty(query, item)
      }
    }
    const data = core.toEntity(query, entity)
    return data
  }
)

// 获取page分页
export const QueryPage = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const query = request.query
  let { pageNum, pageSize } = query
  pageNum = Number(pageNum) || 1
  pageSize = Number(pageSize) || 20
  return { pageNum, pageSize }
})
