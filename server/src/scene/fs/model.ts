import { type File } from '@prisma/client'

export const FileEntity = {
  id: '', // id
  createTime: new Date(), // 创建时间
  filename: '', // 文件名
  filenameOriginal: '', // 文件原始名
  filePath: '' // 文件路径
} satisfies Partial<File>
