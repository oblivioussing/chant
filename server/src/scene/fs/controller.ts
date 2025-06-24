import { Controller, Post, Request } from '@nestjs/common'
import { type File } from '@prisma/client'
import { Result } from '@/share'
import { FsService } from './service'
import { saveFile } from './utils'

@Controller('fs')
export class FsController {
  constructor(private readonly fsService: FsService) {}

  // 文件大小限制
  private FileSize = 1024 * 1024 * 50

  // 上传
  @Post('upload')
  async upload(@Request() req) {
    const part = await req.file({ limits: { fileSize: this.FileSize } })
    // 保存文件
    let result = await saveFile(part)
    if (result.code === '1') {
      result = await this.fsService.upload(result.data)
    }
    return result
  }
  // 批量上传
  @Post('uploads')
  async uploads(@Request() req) {
    const parts = req.files({ limits: { fileSize: this.FileSize } })
    let result = new Result<File[]>()
    const list = [] as File[]
    for await (const part of parts) {
      // 保存文件
      const result = await saveFile(part)
      if (result.code === '1') {
        list.push(result.data)
      }
    }
    if (list.length) {
      result = await this.fsService.uploads(list)
    } else {
      result.fail('上传失败')
    }
    return result
  }
}
