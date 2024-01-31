import type { Column } from '@/chant'

export default () => {
  return [
    {
      prop: 'bonus',
      label: '奖金(元)'
    },
    {
      prop: 'uid',
      label: '员工'
    },
    {
      prop: 'createdTime',
      label: '日期',
      type: 'date-picker',
      datepickerType: 'month'
    }
  ] as Column[]
}
