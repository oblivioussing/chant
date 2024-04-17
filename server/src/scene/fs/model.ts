import { type File } from '@prisma/client'

export const fileEntity = {
  id: '', // id
  createTime: new Date(), // 创建时间
  filename: '', // 文件名
  filenameOriginal: '', // 文件原始名
  filePath: '', // 文件路径
  md5: '' // md5
} as File
