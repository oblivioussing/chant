import type { DatePickType, TagProps } from 'element-plus'

type BaseColumn = {
  append?: string // 输入框后置内容
  clearable?: boolean // 是否可清空
  datepickerType?: DatePickType // date-picker显示类型,仅type为date-picker时有效
  dynamicId?: string // 动态id字段
  dynamicStart?: string // 范围选择start字段
  dynamicEnd?: string // 动态范围选择end字段
  hide?: boolean // 是否隐藏
  hideInPages?: PageType[] // 在特定页面类型中隐藏
  inputType?: 'password' | 'text' | 'textarea'
  label?: string // 标签文本
  precision?: number // 数值精度,仅type为input-number时有效
  prepend?: string // 输入框前置内容
  prop: string // 字段值
  type?: ElementType // 元素类型
  valueFormat?: string // 绑定值的格式,仅type为date-picker时有效
}

export type FormColumn = {
  change?: (row: any) => void // 值变更事件
  default?: any // 默认值
  defaultTime?: Date | [Date, Date] // 范围选择时选中日期所使用的当日内具体时刻
  disabled?: boolean | ((row: any) => boolean) // 是否禁用
  disabledDate?: (data: Date, form: any) => boolean //  用来判断该日期是否被禁用的函数,仅type为date-picker时有效
  disabledInPage?: PageType // 在特定页面类型中禁用
  formSlot?: boolean // 表单slot
  limit?: number // 允许上传文件的最大数量
  min?: number // 最小值,仅type为InputNumber时有效
  max?: number // 最大值,仅type为InputNumber时有效
  multiple?: boolean // 是否支持多选文件
  required?: boolean // 是否必填
  rows?: number // 输入框行数,仅type为Textarea时有效
  rules?: any[] // 表单验证规则
  selectMultiple?: boolean // select是否多选
  showCustom?: (row: any) => boolean // 自定义显示逻辑
  title?: string // 标题
  uploadType?: UploadType // 文件上传类型,仅type为Upload时有效
} & BaseColumn

export type ListColumn = {
  copy?: boolean // 是否可以复制
  editable?: boolean // 是否可编辑
  fixed?: 'left' | 'right' // 列是否固定在左侧或者右侧
  format?: 'money' // 格式化
  like?: boolean // 是否为模糊查询
  listSlot?: boolean // 列表slot
  onlySearch?: boolean // 只作为搜索条件
  search?: boolean // 是否为搜索条件
  searchDatepickerType?: DatePickType // date-picker显示类型,仅type为date-picker时有效
  sarchRequired?: boolean // 搜索条件是否为必填
  searchSlot?: boolean // 搜索slot
  tagType?: Record<string, TagProps['type']> // tag类型
  width?: number // 对应列的宽度
} & BaseColumn

export type Column = BaseColumn & FormColumn & ListColumn

export type ElementType =
  | 'date-picker'
  | 'input'
  | 'input-number'
  | 'input-number-range'
  | 'radio'
  | 'select'
  | 'time-picker'
  | 'upload'

export type Lang = {
  en: Record<string, string>
  zh: Record<string, string>
}

export type FormState = {
  copyFlag?: 0 | 1
  continueAdd?: boolean
  form: any
  formLoading: boolean
  loading: boolean
  pageType?: 'add' | 'edit'
  query: any
  selection?: any
  type: FormType
}

export type FormType = 'dialog' | 'inline' | 'page'

export type ListState = {
  allFlag?: 0 | 1 // 全选
  columns: ListColumn[] // 列表字段
  copyFlag?: 0 | 1 // 复制flag
  editType: 'add' | 'edit' // 新增编辑的类型
  editVisible?: boolean // 新增编辑visible
  extra: Record<string, any> // 页面额外数据
  formType: FormType // 表单操作方式
  keepQuery: Record<string, any> // 持续存在的查询条件
  list: any[] // 列表数据
  loading: boolean // loading
  query: Record<string, any> // 查询条件
  pages: {
    pageNum: number
    pageSize: number
  } // 分页
  selection: any // 当前处理的一条数据
  selections: any[] // 列表选中的数据
  total: number // 总数
}

export type PageType = 'list' | 'add' | 'edit'

export type UploadType =
  | 'file-list'
  | 'picture-card'
  | 'pure-button'
  | 'single-image'
