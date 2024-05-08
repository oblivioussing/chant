import type { File } from 'prisma/prisma-client'
import { Controller, Post, Request } from '@nestjs/common'
import { ApiCode } from '@/enum'
import { Result } from '@/share'
import { FsService } from './service'
import { saveFile } from './utils'

import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'
const pump = util.promisify(pipeline)

@Controller('fs')
export class FsController {
  constructor(private readonly fsService: FsService) {}

  // 上传
  @Post('upload')
  async upload(@Request() req) {
    const part = await req.file({ limits: { fileSize: 1024 * 1024 * 20 } })
    // 保存文件
    let result = await saveFile(part)
    if (result.code === ApiCode.Success) {
      result = await this.fsService.upload(result.data)
    }
    return result
  }
  // 批量上传
  @Post('uploads')
  async uploads(@Request() req) {
    const parts = req.files({ limits: { fileSize: 1024 * 1024 * 2 } })
    let result = new Result<File[]>()

    const list = [] as File[]
    for await (const part of parts) {
      await pump(part.file, fs.createWriteStream(part.filename))
      // 保存文件
      // const result = await saveFile(part)
      // if (result.code === ApiCode.Success) {
      //   list.push(result.data)
      // }
    }
    console.log(list.length)
    if (list.length) {
      result = await this.fsService.uploads(list)
    } else {
      result.fail('上传失败')
    }
    return result
  }
}
