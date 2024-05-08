import fs from 'fs/promises'
import path from 'path'
import type { File } from 'prisma/prisma-client'
import { Result } from '@/share'
import { base } from '@/utils'

// 保存文件
export async function saveFile(part: any) {
  const result = new Result<File>()
  try {
    // const buffer = await part.toBuffer()
    const fileBizType = part.fields.fileBizType.value || 'other'
    const filePath = `./files/${fileBizType}/`
    try {
      await fs.stat(filePath)
    } catch (error) {
      await fs.mkdir(filePath, { recursive: true })
    }
    const id = base.createId()
    const filenameOriginal = part.filename
    const filename = filenameOriginal.replace(/(.*)\./, `${id}.`)
    await fs.writeFile(path.resolve(filePath, filename), part.file)
    const data = {
      id,
      createTime: new Date(),
      filename,
      filenameOriginal,
      filePath
    }
    result.success({ data })
    return result
  } catch (error) {
    result.fail('文件不能超过20M')
    return result
  }
}
