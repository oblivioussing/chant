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
      dynamicPicker: 'user',
      dynamicId: 'userId',
      required: true,
      search: true
    },
    {
      prop: 'date',
      label: '日期',
      search: true,
      datePicker: 'month',
      valueFormat: 'YYYY-MM'
    }
  ] as Column[]
}
