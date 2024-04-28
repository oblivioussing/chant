import type { DatePickType } from 'element-plus'

// 是否为daterange
export function isDateRange(type?: DatePickType) {
  if (type) {
    const list: DatePickType[] = ['daterange', 'datetimerange', 'monthrange']
    return list.includes(type)
  }
}
