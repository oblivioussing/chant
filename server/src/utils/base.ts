import { customAlphabet } from 'nanoid'

import { decrypt } from './crypto'

// 创建id
export function createId() {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20)
  return nanoid()
}
// 创建uid
export function createUid() {
  const nanoid = customAlphabet('1234567890', 20)
  return nanoid()
}
// 根据token获取uid
export function getUidByToken(token: string) {
  const [iv, hash] = token?.split('.') || []
  if (iv && hash) {
    return decrypt(iv, hash)
  } else {
    return ''
  }
}
// 是否为Date
export function isDate(value: any) {
  return value instanceof Date
}
