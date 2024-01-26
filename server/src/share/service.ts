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
}
