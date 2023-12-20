import { FormTypeEnum } from '@/enum'
import { type ListColumn as Column } from '@/type'

export default [
  {
    prop: 'name', // 姓名
    copy: true,
    search: true
  },
  {
    prop: 'age', // 年龄
    search: true,
    type: FormTypeEnum.InputNumberRange
  },
  {
    prop: 'sex', // 性别
    search: true,
    type: FormTypeEnum.Select
  },
  {
    prop: 'createTime', // 创建时间
    search: true,
    type: FormTypeEnum.DatetimeRange
  },
  {
    prop: 'updateTime', // 更新时间
    search: true,
    type: FormTypeEnum.Datetime
  }
] as Column[]