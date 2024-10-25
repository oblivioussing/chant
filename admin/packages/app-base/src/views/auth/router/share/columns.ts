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
      show(row: Model) {
        if (row.type === '4') {
          return true
        }
        if (row.level === 2) {
          return !row.threeMenu
        }
        if (row.level === 3) {
          return row.threeMenu
        }
      }
    },
    {
      prop: 'type',
      label: '类型',
      type: 'radio',
      show(row: Model) {
        if (row.threeMenu) {
          return row.level === 4
        }
        return row.level === 3
      }
    },
    {
      prop: 'code',
      label: '编号',
      required: true,
      show(row: Model) {
        if (row.threeMenu) {
          return row.level === 4
        }
        return row.level === 3
      }
    },
    {
      prop: 'icon',
      label: '图标',
      hideInPages: ['list'],
      required: true,
      slot: ['form'],
      show(row: Model) {
        return row.level === 1
      }
    },
    {
      prop: 'threeMenu',
      label: '三级菜单',
      hideInPages: ['list'],
      type: 'radio',
      show(row: Model) {
        return row.level === 2
      }
    }
  ] as Column[]
}
