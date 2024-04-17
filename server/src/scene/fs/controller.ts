import fs from 'fs/promises'
import path from 'path'
import { Controller, Post, Request } from '@nestjs/common'
import { FsService } from './service'
import { Result } from '@/share'
import { base } from '@/utils'

@Controller('fs')
export class FsController {
  constructor(private readonly fsService: FsService) {}

  // 上传
  @Post('upload')
  async upload(@Request() req) {
    const data = await req.file({
      limits: { fileSize: 1024 * 1024 * 20 }
    })
    try {
      await data.toBuffer()
    } catch (err) {
      const result = new Result()
      result.msg = '文件不能超过20M'
      return result
    }
    const fileBizType = data.fields.fileBizType.value || 'other'
    let filePath = `./files/${fileBizType}`
    try {
      await fs.stat(filePath)
    } catch (error) {
      await fs.mkdir(filePath, { recursive: true })
    }
    const filename = data.filename.replace(/(.*)\./, `${base.createId()}.`)
    filePath = path.resolve(filePath, filename)
    await fs.writeFile(filePath, data.file)
    const result = await this.fsService.upload(req)
    return result
  }
}
