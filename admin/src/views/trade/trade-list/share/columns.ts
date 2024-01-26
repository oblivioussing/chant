import type { Column } from '@/chant'

export default () => {
  return [
    {
      prop: 'amount',
      label: '售价(元)',
      required: true,
      type: 'input-number',
      precision: 2
    },
    {
      prop: 'userName',
      label: '销售员',
      required: true,
      slot: true
    },
    {
      prop: 'commission',
      label: '提成',
      search: true,
      type: 'select'
    },
    {
      prop: 'belongName',
      label: '所属人',
      slot: true
    },
    {
      prop: 'status',
      label: '状态',
      hideInPages: ['add'],
      type: 'select'
    },
    {
      prop: 'remark',
      label: '备注',
      inputType: 'textarea'
    },
    {
      prop: 'createName',
      label: '创建人',
      hideInPages: ['add', 'edit']
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'date-picker',
      datepickerType: 'datetime',
      hideInPages: ['add', 'edit']
    }
  ] as Column[]
}
