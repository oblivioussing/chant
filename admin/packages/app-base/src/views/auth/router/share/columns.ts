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
      show(model: Model) {
        if (model.type === '4') {
          return true
        }
        if (model.level === 2) {
          return !model.threeMenu
        }
        if (model.level === 3) {
          return model.threeMenu
        }
      }
    },
    {
      prop: 'type',
      label: '类型',
      type: 'radio',
      show(model: Model) {
        if (model.threeMenu) {
          return model.level === 4
        }
        return model.level === 3
      }
    },
    {
      prop: 'code',
      label: '编号',
      required: true,
      show(model: Model) {
        if (model.threeMenu) {
          return model.level === 4
        }
        return model.level === 3
      }
    },
    {
      prop: 'icon',
      label: '图标',
      hideInPages: ['list'],
      required: true,
      slot: ['form'],
      show(model: Model) {
        return model.level === 1
      }
    },
    {
      prop: 'threeMenu',
      label: '三级菜单',
      hideInPages: ['list'],
      type: 'radio',
      show(model: Model) {
        return model.level === 2
      }
    }
  ] as Column[]
}
