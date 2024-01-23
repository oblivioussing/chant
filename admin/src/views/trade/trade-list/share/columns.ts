import type { Column } from '@/chant'

export default () => {
  return [
    {
      prop: 'commission',
      label: '提成(百分比)',
      search: true,
      type: 'select'
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select'
    },
    {
      prop: 'uid',
      label: '用户id'
    },
    {
      prop: 'remark',
      label: '备注'
    },
    {
      prop: 'createId',
      label: '创建人id',
      hideInPages: ['add', 'edit']
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'date-picker'
    }
  ] as Column[]
}
