import type { Column } from 'chant'

export default () => {
  return [
    {
      prop: 'first',
      label: '一级菜单',
      slot: ['list'],
      width: 100
    },
    {
      prop: 'second',
      label: '二级菜单',
      slot: ['list'],
      width: 100
    },
    {
      prop: 'third',
      label: '三级菜单',
      slot: ['list'],
      width: 100
    },
    {
      prop: 'funs',
      label: '功能',
      slot: ['list']
    }
  ] as Column[]
}
