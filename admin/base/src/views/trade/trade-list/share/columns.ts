import type { Column } from '@/chant'

export default () => {
  return [
    {
      prop: 'amount', // 售价(元)
      required: true,
      type: 'input-number',
      precision: 2
    },
    {
      prop: 'userName', // 销售员
      dynamicId: 'userId',
      required: true,
      search: true,
      type: 'custom-picker',
      customPicker: 'user-picker'
    },
    {
      prop: 'commission', // 提成
      search: true,
      type: 'select'
    },
    {
      prop: 'belongName', // 所属人
      dynamicId: 'belongId',
      search: true,
      type: 'custom-picker',
      customPicker: 'user-picker'
    },
    {
      prop: 'status', // 状态 1-正常 2-作废
      hideInPages: ['add'],
      search: true,
      tagType: {
        1: 'success',
        2: 'danger'
      },
      type: 'select'
    },
    {
      prop: 'remark', // 备注
      inputType: 'textarea'
    }
  ] as Column[]
}
