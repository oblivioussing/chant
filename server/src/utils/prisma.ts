import { PrismaClient } from '@prisma/client'

const prismaInstance = new PrismaClient()

// 获取实例
export function getInstance() {
  return prismaInstance
}
