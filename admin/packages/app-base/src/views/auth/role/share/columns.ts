import type { Column } from 'chant'

export default () => {
  return [
    {
      prop: 'name',
      label: '一级菜单',
      width: 144
    },
    {
      prop: 'two',
      label: '二级菜单',
      width: 144
    },
    {
      prop: 'three',
      label: '三级菜单',
      width: 144
    },
    {
      prop: 'auth',
      label: '权限'
    }
  ] as Column[]
}
