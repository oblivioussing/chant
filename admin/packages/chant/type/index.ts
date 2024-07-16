import type { DatePickType, FormItemRule, TagProps } from 'element-plus'

export type DynamicPicker = 'user' | 'org-tree'

export type ElementType =
  | 'input-number'
  | 'input-number-range'
  | 'radio'
  | 'select'
  | 'time-picker'
  | 'upload'

export type FileBizType = 'avatar'

export type PageType = 'add' | 'edit' | 'detail'

export type FormType = 'dialog' | 'inline' | 'page'

export type ColumnPage = PageType | 'list'

type BaseColumn = {
  append?: string // 输入框后置内容
  clearable?: boolean // 是否可清空
  datePicker?: DatePickType // date-picker显示类型
  disabledDate?: (data: Date) => boolean // 日期是否禁用,仅date-picker时有效
  dynamicId?: string // 动态id字段
  dynamicText?: string // 动态text字段
  dynamicStart?: string // 范围选择start字段
  dynamicEnd?: string // 动态范围选择end字段
  dynamicPicker?: DynamicPicker // 自定义picker
  filterable?: boolean // 是否可筛选,仅type为select时有效
  hide?: boolean // 是否隐藏
  hideInPages?: ColumnPage[] // 在特定页面类型中隐藏
  inputType?: 'password' | 'text' | 'textarea'
  label?: string // 标签文本
  precision?: number // 数值精度,仅type为input-number时有效
  prepend?: string // 输入框前置内容
  prop: string // 字段值
  selectMultiple?: boolean // select是否多选,仅type为select时有效
  slot?: SlotType[] // slot
  type?: ElementType // 元素类型
  valueFormat?: string // 绑定值的格式,仅date-picker时有效
}

type SlotType = 'form' | 'form-item' | 'list' | 'search'

export type FormColumn = {
  change?: (form: any, row?: any) => void // 值变更事件
  default?: any // 默认值
  defaultTime?: Date | [Date, Date] // 范围选择时选中日期所使用的当日内具体时刻
  disabled?: boolean | ((row: any) => boolean) // 是否禁用
  disabledInPage?: ColumnPage // 在特定页面类型中禁用
  min?: number // 最小值,仅type为InputNumber时有效
  max?: number // 最大值,仅type为InputNumber时有效
  multiple?: boolean // 是否支持多选文件
  newline?: boolean // 是否换行
  newlineFull?: boolean // 是否换行并显示为一整行
  required?: boolean // 是否必填
  rows?: number // 输入框行数,仅type为Textarea时有效
  rules?: FormItemRule[] // 表单验证规则
  showCustom?: (row: any) => boolean // 自定义显示逻辑
  tips?: string // 提示
  title?: string // 标题
  accept?: string // 接受上传的文件类型,仅type为Upload时有效
  fileBizType?: FileBizType // 文件业务类型,仅type为Upload时有效
  fileSize?: number // 允许上传文件的大小(MB),仅type为Upload时有效
  limit?: number // 允许上传文件的最大数量,仅type为Upload时有效
  uploadType?: UploadType // 文件上传类型,仅type为Upload时有效
} & BaseColumn

export type ListColumn = {
  copy?: boolean // 是否可以复制
  editable?: boolean // 是否可编辑
  fixed?: 'left' | 'right' // 列是否固定在左侧或者右侧
  format?: string // 格式化
  link?: boolean // 超链
  onlySearch?: boolean // 只作为搜索条件
  propList?: string // 列表显示的字段
  search?: boolean // 是否为搜索条件
  searchDatepicker?: DatePickType // date-picker显示类型,仅date-picker时有效
  searchRequired?: boolean // 搜索条件是否为必填
  sortable?: boolean // 对应列是否可以排序
  tagType?: Record<string, TagProps['type']> // tag类型
  width?: number // 对应列的宽度
} & BaseColumn

export type Column = FormColumn & ListColumn

export type Lang = {
  en: Record<string, string | Record<string, string>>
  zh: Record<string, string | Record<string, string>>
}

export type FormState = {
  continueAdd?: boolean // 是否继续新增
  copyFlag?: 0 | 1 // 是否复制新增
  form: any // 表单数据
  formLoading: boolean // 表单加载loading
  loading: boolean // 保存loading
  query: any // 查询条件
  selection: any // 携带的数据
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
  ids?: string[]
  all?: number
  searchForm?: Record<string, any>
}

export type ListState = {
  all?: 0 | 1 // 全选
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

export type MenuItem = {
  children?: MenuItem[]
  icon?: string
  id: string
  level?: number
  meta: {
    funs?: string[]
    title?: string
  }
  path: string
  threeMenu?: 0 | 1
}

export type TablePickerProps = {
  apiPath: string // 接口地址
  columns: ListColumn[] // 列表字段
  columnsSet?: ListColumn['prop'][] // 将columns中的字段显示在右侧
  disabled?: boolean // 禁用
  dict?: any // 字典
  lang?: any // 国际化
  title: string // 显示的标题
  width?: string | number // 宽度
}

export type UploadType = 'file-list' | 'picture-card' | 'single-image'
