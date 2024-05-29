export { default as columns } from './columns'
export { default as dict } from './dict'
export type Model = {
  id: string
  code: string
  icon: string
  level: number
  name: string
  parentId: string
  path: string
  threeMenu: 0 | 1
  type: '1' | '2' | '3' | '4' | '5'
}
