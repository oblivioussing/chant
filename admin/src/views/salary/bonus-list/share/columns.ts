import type { Column } from '@/chant'

export default () => {
  return [
    {
      prop: 'bonus',
      label: '奖金(元)'
    },
    {
      prop: 'userName',
      label: '员工',
      slotSearch: true
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
