import type { Column } from 'chant'

export default () => {
  return [
    {
      prop: 'name',
      label: '名称',
      required: true,
      search: true
    },
    {
      prop: 'roleName',
      label: '角色'
    }
  ] as Column[]
}
