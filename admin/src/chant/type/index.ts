import type { DatePickType, FormItemRule, TagProps } from 'element-plus'

export type CustomPicker = 'user-picker'

export type ElementType =
  | 'custom-picker'
  | 'date-picker'
  | 'input'
  | 'input-number'
  | 'input-number-range'
  | 'radio'
  | 'select'
  | 'time-picker'
  | 'upload'

export type PageType = 'add' | 'edit' | 'detail'

export type FormType = 'dialog' | 'inline' | 'page'

export type ColumnPage = PageType | 'list'

type BaseColumn = {
  append?: string // 输入框后置内容
  clearable?: boolean // 是否可清空
  customPicker?: CustomPicker // 自定义picker
  datepickerType?: DatePickType // date-picker显示类型,仅type为date-picker时有效
  dynamicId?: string // 动态id字段
  dynamicText?: string // 动态text字段
  dynamicStart?: string // 范围选择start字段
  dynamicEnd?: string // 动态范围选择end字段
  hide?: boolean // 是否隐藏
  hideInPages?: ColumnPage[] // 在特定页面类型中隐藏
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
  disabledInPage?: ColumnPage // 在特定页面类型中禁用
  limit?: number // 允许上传文件的最大数量
  min?: number // 最小值,仅type为InputNumber时有效
  max?: number // 最大值,仅type为InputNumber时有效
  multiple?: boolean // 是否支持多选文件
  required?: boolean // 是否必填
  rows?: number // 输入框行数,仅type为Textarea时有效
  rules?: FormItemRule[] // 表单验证规则
  selectMultiple?: boolean // select是否多选
  showCustom?: (row: any) => boolean // 自定义显示逻辑
  slotForm?: boolean // 表单slot
  tips?: string // 提示
  title?: string // 标题
  uploadType?: UploadType // 文件上传类型,仅type为Upload时有效
} & BaseColumn

export type ListColumn = {
  copy?: boolean // 是否可以复制
  editable?: boolean // 是否可编辑
  fixed?: 'left' | 'right' // 列是否固定在左侧或者右侧
  format?: string // 格式化
  like?: boolean // 是否为模糊查询
  onlySearch?: boolean // 只作为搜索条件
  search?: boolean // 是否为搜索条件
  searchDatepickerType?: DatePickType // date-picker显示类型,仅type为date-picker时有效
  searchRequired?: boolean // 搜索条件是否为必填
  slotList?: boolean // 列表slot
  slotSearch?: boolean // 搜索slot
  sortable?: boolean // 对应列是否可以排序
  tagType?: Record<string, TagProps['type']> // tag类型
  width?: number // 对应列的宽度
} & BaseColumn

export type Column = BaseColumn & FormColumn & ListColumn

export type Lang = {
  en: Record<string, string | Record<string, string>>
  zh: Record<string, string | Record<string, string>>
}

export type FormState = {
  copyFlag?: 0 | 1 // 是否复制新增
  continueAdd?: boolean // 是否继续新增
  form: any // 表单数据
  formLoading: boolean // 表单加载loading
  loading: boolean // 保存loading
  pageType?: PageType // 页面类型
  query: any // 查询条件
  type: FormType // 页面类型
}

export type FormProps = {
  copyFlag?: 0 | 1
  pageType: PageType
  selection?: { id: string }
  type?: FormType
}

export type FormEmits = {
  close: []
  update: []
}

export type ListParams = {
  idList?: string[]
  allFlag?: number
  searchForm?: Record<string, any>
}

export type ListState = {
  allFlag?: 0 | 1 // 全选
  columns: ListColumn[] // 列表字段
  copyFlag?: 0 | 1 // 复制flag
  mixForm?: boolean // mix-form是否显示
  extra: Record<string, any> // 页面额外数据
  formType: FormType // 表单操作方式
  keepQuery: Record<string, any> // 持续存在的查询条件
  list: any[] // 列表数据
  loading: boolean // loading
  pages: {
    pageNum: number
    pageSize: number
  } // 分页
  pageType: PageType // 页面类型
  pickerText: Record<string, any> // 查找带回的text
  query: Record<string, any> // 查询条件
  selection: any // 当前处理的一条数据
  selections: any[] // 列表选中的数据
  total: number // 总数
}

export type TablePickerProps = {
  apiPath: string // 接口地址
  columns: ListColumn[] // 列表字段
  columnsSet?: ListColumn['prop'][] // 将columns中的字段显示在右侧
  dict?: any // 字典
  lang?: any // 国际化
  title: string // 显示的标题
  width?: string | number // 宽度
}

export type UploadType =
  | 'file-list'
  | 'picture-card'
  | 'pure-button'
  | 'single-image'
