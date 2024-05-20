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
      prop: 'path',
      label: '路径',
      required: true,
      search: true,
      whole: true,
      showCustom(row) {
        return [2, 4].includes(row.level)
      }
    },
    {
      prop: 'icon',
      label: '图标',
      hideInPages: ['list'],
      required: true,
      slotForm: true,
      showCustom(row) {
        return row.level === 1
      }
    }
  ] as Column[]
}
