import type { File, Prisma } from '@prisma/client'
import { base } from '@/utils'
import { BaseService, Result } from '@/share'
import { fileEntity } from './model'

export class FsService extends BaseService {
  private file: Prisma.FileDelegate

  constructor() {
    super()
    this.file = this.prisma.file
  }

  // 上传
  async upload(data: File) {
    const result = new Result<File>()
    data.createTime = new Date()
    data.id = base.createUid()
    const row = await this.file.create({ data })
    if (row) {
      result.success({ data: row, msg: '文件上传成功' })
    } else {
      result.fail('文件上传失败')
    }
    return result
  }
  // 根据md5查询数据
  async rowByMd5(md5: string) {
    const data = await this.file.findUnique({
      select: base.entityToSelect(fileEntity),
      where: { md5 }
    })
    return data
  }
}
