import type { TagProps } from 'element-plus'
import { FormatEnum, FormTypeEnum, PageTypeEnum, UploadTypeEnum } from '@/chant'

export type FormColumn = {
  append?: string // 输入框后置内容
  clearable?: boolean // 是否可清空
  change?: (row: any) => void // 值变更事件
  defaultValue?: any // 默认值
  disabled?: boolean | ((row: any) => boolean) // 是否禁用
  disabledInPage?: PageTypeEnum // 在特定页面类型中禁用
  dynamicId?: string // 动态id字段
  dynamicStart?: string // 范围选择start字段
  dynamicEnd?: string // 动态范围选择end字段
  hide?: boolean // 是否隐藏
  hideInPage?: PageTypeEnum // 在特定页面类型中隐藏
  label?: string // 标签文本
  limit?: number // 允许上传文件的最大数量
  min?: number // 最小值,仅type为InputNumber时有效
  max?: number // 最大值,仅type为InputNumber时有效
  multiple?: boolean // 是否支持多选文件
  prepend?: string // 输入框前置内容
  prop: string // 字段值
  required?: boolean // 是否必填
  rows?: number // 输入框行数,仅type为Textarea时有效
  rules?: any[] // 表单验证规则
  selectMultiple?: boolean // select是否多选
  showCustom?: (row: any) => boolean // 自定义显示逻辑
  slot?: boolean // 字段内容slot
  title?: string // 标题
  type?: FormTypeEnum // 标签类型
  valueFormat?: string // 绑定值的格式,仅type为Date,Datetime时有效
  uploadType?: UploadTypeEnum // 文件上传类型,仅type为Upload时有效
}

export type ListColumn = {
  append?: string // 输入框后置内容
  clearable?: boolean // 是否可清空
  copy?: boolean // 是否可以复制
  dynamicId?: string // 动态id字段
  dynamicStart?: string // 范围选择start字段
  dynamicEnd?: string // 动态范围选择end字段
  editable?: boolean // 是否可编辑
  fixed?: 'left' | 'right' // 列是否固定在左侧或者右侧
  format?: FormatEnum // 格式化
  hide?: boolean // 是否隐藏
  label?: string // 标签文本
  like?: boolean // 是否为模糊查询
  onlySearch?: boolean // 只作为搜索条件
  prepend?: string // 输入框前置内容
  prop: string // 字段值
  required?: boolean // 是否必填,仅在搜索条件中生效
  search?: boolean // 是否为搜索条件
  searchSlot?: boolean // 搜索条件slot
  slot?: boolean // 字段内容slot
  tagType?: Record<string, TagProps['type']> // 标签类型
  type?: FormTypeEnum // 标签类型
  valueFormat?: string // 绑定值的格式
  width?: number // 对应列的宽度
}

export type ListState = {
  allFlag?: 0 | 1 // 全选
  columns: ListColumn[] // 列表字段
  extra: Record<string, any> // 页面额外数据
  keepQuery: Record<string, any> // 持续存在的查询条件
  list: any[] // 列表数据
  loading: boolean // loading
  query: Record<string, any> // 查询条件
  pages: {
    pageNum: number
    pageSize: number
  } // 分页
  selection: any[] // 选中列表数据
  total: number // 总数
}
