export { default as columns } from './columns'
export { default as dict } from './dict'
export type Model = {
  id: string
  level: number
  name: string
  parentId: string
  roleIds: string[]
}
