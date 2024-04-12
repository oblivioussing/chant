import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FsService } from './service'

@Controller('fs')
export class FsController {
  constructor(private readonly fsService: FsService) {}

  // 上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.fsService.upload(file)
    return result
  }
}
