import type { Column } from 'chant'

export default () => {
  return [
    {
      prop: 'icon',
      label: '图标'
    },
    {
      prop: 'level',
      label: '等级',
      required: true
    },
    {
      prop: 'name',
      label: '名称',
      required: true,
      search: true
    },
    {
      prop: 'path',
      label: '路径',
      required: true,
      search: true
    }
  ] as Column[]
}
