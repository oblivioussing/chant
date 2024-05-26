export { default as columns } from './columns'
export { default as dict } from './dict'
export type Model = {
  id: string
  name: string
  level: number
  icon: string
  parentId: string
  threeLevel: 0 | 1
}
