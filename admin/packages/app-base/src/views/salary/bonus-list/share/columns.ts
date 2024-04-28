import type { Column } from '@app-base/chant'

export default () => {
  return [
    {
      prop: 'bonus',
      label: '奖金(元)'
    },
    {
      prop: 'userName',
      label: '员工',
      dynamicId: 'userId',
      required: true,
      search: true,
      type: 'custom-picker',
      customPicker: 'user-picker'
    },
    {
      prop: 'date',
      label: '日期',
      search: true,
      type: 'date-picker',
      datepickerType: 'month',
      valueFormat: 'YYYY-MM'
    }
  ] as Column[]
}
