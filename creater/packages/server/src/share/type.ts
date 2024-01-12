type ListItem = {
  COLUMN_COMMENT: string
  COLUMN_NAME: string
  required?: 0 | 1
  type?: string
}
export type Type = '1' | '2' // 1.前端 2.后端
export type Form = {
  list?: ListItem[] // 列表
  type: Type // 类型
  path?: string // 路由
}
