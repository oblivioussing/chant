import { type Column } from '@chant2'

// 显示input标签
export function showInput(column: Column) {
  return (
    !column.type &&
    !column.dynamicPicker &&
    !column.datePicker &&
    !column.uploader
  )
}
