import fs from 'fs/promises'
import path from 'path'
import type { File } from 'prisma/prisma-client'
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
    let result = new Result<File>()
    try {
      const buffer = await data.toBuffer()
      // 判断文件是否已经上传过
      const md5 = data.fields.md5?.value || ''
      const row = await this.fsService.rowByMd5(md5)
      if (row) {
        result.success({ data: row, msg: '文件上传成功' })
        return result
      }
      // 保存文件
      const fileBizType = data.fields.fileBizType.value || 'other'
      const filePath = `./files/${fileBizType}`
      try {
        await fs.stat(filePath)
      } catch (error) {
        await fs.mkdir(filePath, { recursive: true })
      }
      const filename = data.filename.replace(/(.*)\./, `${base.createId()}.`)
      try {
        await fs.writeFile(path.resolve(filePath, filename), buffer)
        const params = {
          filename,
          filenameOriginal: data.filename,
          filePath: filePath,
          md5
        } as File
        result = await this.fsService.upload(params)
        return result
      } catch (error) {
        result.fail('文件保存失败')
        return result
      }
    } catch (err) {
      result.msg = '文件不能超过20M'
      return result
    }
  }
}
