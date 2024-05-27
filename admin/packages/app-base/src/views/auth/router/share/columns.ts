import type { Column } from 'chant'
import { type Model } from './index'

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
      showCustom(row: Model) {
        if (row.threeMenu) {
          return row.level === 3
        }
        if (row.level >= 3) {
          return row.type === '4'
        }
        return row.level === 2
      }
    },
    {
      prop: 'type',
      label: '类型',
      type: 'radio',
      showCustom(row: Model) {
        if (row.threeMenu) {
          return false
        }
        return row.level >= 3
      }
    },
    {
      prop: 'icon',
      label: '图标',
      hideInPages: ['list'],
      required: true,
      slotForm: true,
      showCustom(row: Model) {
        return row.level === 1
      }
    },
    {
      prop: 'threeMenu',
      label: '三级菜单',
      hideInPages: ['list'],
      type: 'radio',
      showCustom(row: Model) {
        return row.level === 2
      }
    }
  ] as Column[]
}
