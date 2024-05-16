import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Prisma, PrismaClient } from '@prisma/client'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { base } from '@/utils'

@Injectable()
export class BaseService {
  @Inject(I18nService)
  private readonly i18n: I18nService
  @Inject(REQUEST)
  private readonly request: Request // request
  prisma = new PrismaClient() // prisma

  // 获取文件
  async getFiles(ids: string[]) {
    if (ids?.length) {
      const rows = await this.prisma.$queryRaw<File[]>`
        SELECT 
          id,
          create_time AS createTime,
          filename,
          filename_original AS filenameOriginal,
          file_path AS filePath
        FROM
          chant.file
        WHERE
          id IN (${Prisma.join(ids)})
        ORDER BY FIELD(id, ${Prisma.join(ids)});
      `
      return rows as any[]
    } else {
      return []
    }
  }
  // 获取uid
  getUid() {
    const token = this.request.headers['token']
    return base.getUidByToken(token)
  }
  // 国际化
  t(text: string) {
    const lang = I18nContext.current().lang
    return this.i18n.t(text, { lang })
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
