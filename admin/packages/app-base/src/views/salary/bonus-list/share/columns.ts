import type { Column } from 'chant'

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
      customPicker: 'user'
    },
    {
      prop: 'date',
      label: '日期',
      search: true,
      datepicker: 'month',
      valueFormat: 'YYYY-MM'
    }
  ] as Column[]
}
