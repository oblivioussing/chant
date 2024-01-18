import type { FormType } from '@/chant'

export type FormProps = {
  copyFlag?: 0 | 1
  pageType: 'add' | 'edit'
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
export type PageRelation = Record<string, { parent: string }>
