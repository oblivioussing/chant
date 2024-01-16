export type Type = '1' | '2' // 1.前端 2.后端
export type Form = {
  list?: any[] // 列表
  type: Type // 类型
  routePath?: string // 路由
}
