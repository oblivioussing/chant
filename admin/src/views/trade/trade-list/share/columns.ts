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
      formSlot: true,
      required: true
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
      formSlot: true
    },
    {
      prop: 'status',
      label: '状态',
      hideInPages: ['add'],
      tagType: {
        1: 'success',
        2: 'danger'
      },
      type: 'select'
    },
    {
      prop: 'remark',
      label: '备注',
      inputType: 'textarea'
    }
  ] as Column[]
}
