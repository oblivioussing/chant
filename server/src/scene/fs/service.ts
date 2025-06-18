import type { File } from '@prisma/client'
import { prisma, BaseService, Result } from '@/share'

export class FsService extends BaseService {
  // 上传
  async upload(data: File) {
    const result = new Result<File>()
    const row = await prisma.file.create({ data })
    if (row) {
      result.success({ data: row, msg: '文件上传成功' })
    } else {
      result.fail('文件上传失败')
    }
    return result
  }
  // 批量上传
  async uploads(data: File[]) {
    const result = new Result<File[]>()
    const rows = await prisma.file.createMany({ data })
    if (rows) {
      result.success({ data, msg: '文件上传成功' })
    } else {
      result.fail('文件上传失败')
    }
    return result
  }
}
