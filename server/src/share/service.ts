import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { PrismaClient } from '@prisma/client'
import { base } from '@/utils'

@Injectable()
export class BaseService {
  @Inject(REQUEST)
  private readonly request: Request // request
  prisma = new PrismaClient() // prisma

  // 获取uid
  getUid() {
    const token = this.request.headers['token']
    return base.getUidByToken(token)
  }
  // 用户id转为name
  async userIdToName<T extends Record<string, any>>(
    data: T,
    list: (keyof T)[]
  ) {
    const ids = list.map((item) => data[item])
    const userName = await this.getUserName(ids)
    const obj = JSON.parse(JSON.stringify(data))
    list.forEach((row: string) => {
      const name = row.replace(/Id/, 'Name')
      obj[name] = userName[data[row]]
    })
    return obj
  }
  // 用户ids转为name
  async userIdsToName<T extends Record<string, any>>(
    data: T[],
    list: (keyof T)[]
  ) {
    let ids = data.reduce((acc, cur) => {
      list.forEach((item) => {
        cur[item] && acc.push(cur[item])
      })
      return acc
    }, [])
    ids = Array.from(new Set(ids))
    const userName = await this.getUserName(ids)
    return data.map((item: any) => {
      list.forEach((row: string) => {
        const name = row.replace(/Id/, 'Name')
        item[name] = userName[item[row]]
      })
      return item
    })
  }
  // 获取用户姓名
  private async getUserName(ids: string[]) {
    const data = await this.prisma.user.findMany({
      select: { id: true, name: true },
      where: { id: { in: ids } }
    })
    return data.reduce((acc, cur) => {
      acc[cur.id] = cur.name
      return acc
    }, {})
  }
}
