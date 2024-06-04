import type { Column } from 'chant'

export default () => {
  return [
    {
      prop: 'first',
      label: '一级菜单',
      width: 144
    },
    {
      prop: 'second',
      label: '二级菜单',
      width: 144
    },
    {
      prop: 'third',
      label: '三级菜单',
      width: 144
    },
    {
      prop: 'funs',
      label: '功能'
    }
  ] as Column[]
}
