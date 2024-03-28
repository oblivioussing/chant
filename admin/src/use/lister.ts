import { type TableInstance } from 'element-plus'
import { nextTick, onActivated, onScopeDispose } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { shiki } from '@/api'
import type { ListState as State, FormType, PageType } from '@/chant'
import { ApiCode, LangEnum } from '@/enum'
import { element } from '@/plugs'
import { useAppStore } from '@/store'
import { useChaoser } from '@/use'
import { bus } from '@/utils'

function useLister(config?: { type: FormType }) {
  const appStore = useAppStore()
  const chaoser = useChaoser()
  const { t: tg } = useI18n({ useScope: 'global' })
  const route = useRoute()
  const state = {
    allFlag: 0 as 0 | 1,
    columns: [],
    copyFlag: 0 as 0 | 1,
    extra: {} as Record<string, any>,
    formType: config?.type || 'dialog',
    keepQuery: {} as Record<string, any>,
    list: [] as any[],
    loading: false,
    mixForm: false,
    pages: { pageNum: 1, pageSize: 20 },
    pageType: '' as PageType,
    query: {} as Record<string, any>,
    selection: {} as any,
    selections: [] as any[],
    total: 0
  }
  let tableInstance: TableInstance

  // 新增
  function add(state: State) {
    if (state.formType === 'page') {
      _jump('/add')
    } else {
      state.pageType = 'add'
      state.mixForm = true
    }
  }
  // 批量操作
  function batch(
    path: string,
    state: State,
    config: {
      confirmTip: string
    }
  ) {
    const confirmTip = config.confirmTip
    const params = getListParams(state)
    const count = params.allFlag ? state.total : state.selections.length
    const title = tg('tips.totalRecords', [count])
    operate(path, state, { confirmTip, params, title })
  }
  // 绑定列表实例
  function bindInstance(val: TableInstance) {
    tableInstance = val
  }
  // 复制新增
  function copy(state: State, row: any) {
    if (state.formType === 'page') {
      _jump('/add', { id: row.id, copyFlag: 1 })
    } else {
      state.copyFlag = 1
      state.selection = row
      state.pageType = 'add'
      state.mixForm = true
    }
  }
  // created
  function created(
    callback: () => void,
    state?: State,
    config?: {
      queryMerge?: boolean
    }
  ) {
    // 参数合并
    if (state) {
      if (config?.queryMerge !== false) {
        Object.assign(state.query, route.query)
      }
      // onActivated
      onActivated(() => {
        // 路由参数是否变化
        const status = _isRouterQueryModify(state)
        if (status) {
          _reset(state)
          if (config?.queryMerge !== false) {
            Object.assign(state.query, route.query)
          }
          callback()
        }
      })
    }
    // 事件监听
    _on(callback)
    // callback
    callback()
  }
  // 数据处理
  function dataDeal(state: State, data?: any, limit?: boolean) {
    if (data) {
      if (limit !== false) {
        state.list = data?.list || []
        state.total = data?.total || 0
      } else {
        state.list = data as any
      }
      state.extra = data?.extra || {}
    } else {
      state.list = []
    }
    nextTick(() => {
      state.loading = false
    })
  }
  // 编辑
  function edit(state: State, row: any) {
    if (state.formType === 'page') {
      _jump('/edit', { id: row.id })
    } else {
      state.selection = row
      state.pageType = 'edit'
      state.mixForm = true
    }
  }
  // 获取数据
  async function getData(
    path: string,
    state: State,
    config?: {
      limit?: boolean
      custom?: boolean
    }
  ) {
    const query = getQuery(state)
    if (config?.limit !== false) {
      Object.assign(query, state.pages)
    }
    state.loading = true
    const { data } = await shiki.get(path, query)
    // 返回数据
    if (config?.custom) {
      state.loading = false
      return data
    }
    // 数据处理
    dataDeal(state, data, config?.limit)
  }
  // 获取查询参数
  function getQuery(state: State) {
    const query = { ...state.keepQuery, ...state.query }
    return query
  }
  // 获取列表参数
  function getListParams(state: State) {
    return {
      idList: state.selections.map((item) => item.id),
      allFlag: state.allFlag,
      search: getQuery(state)
    }
  }
  // 是否选中数据
  function isSelected(state: State) {
    return state.selections.length > 0 || state.allFlag === 1
  }
  // 操作
  async function operate(
    path: string,
    state: State,
    config?: {
      title?: string
      confirmTip?: string
      params?: object
    }
  ) {
    const { confirmTip, title } = config || {}
    if (confirmTip) {
      const status = await element.confirm(confirmTip, { title })
      if (!status) {
        return
      }
    }
    state.loading = true
    const { code } = await shiki.post(path, config?.params)
    state.loading = false
    if (code === ApiCode.Success) {
      bus.emit(route.path)
    }
  }
  // 删除
  function remove(path: string, state: State, params: any) {
    operate(path, state, {
      confirmTip: tg('tips.confirmDelete'),
      params
    })
  }
  // 批量删除
  function removes(path: string, state: State) {
    batch(path, state, { confirmTip: tg('tips.confirmBatchDelete') })
  }
  // 标题
  function title(state: State) {
    const meta = chaoser.getMetaByPath(route.path) as any
    if (!meta?.title) {
      return ''
    }
    const pageText = tg(`router.${meta?.title}`)?.replace(tg('app.list'), '')
    const map = {
      add: tg('button.add'),
      edit: tg('button.edit'),
      detail: tg('button.detail')
    }
    let typeText = map[state.pageType]
    if ([LangEnum.En].includes(appStore.state.lang)) {
      typeText = ` ${typeText}`
    }
    return `${pageText?.trim()}${typeText}`
  }
  // 切换某一行的选中状态
  function toggleRowSelection(row: any, selected?: boolean) {
    // @ts-expect-error
    tableInstance.toggleRowSelection(row, selected)
  }
  // 路由参数是否变化
  function _isRouterQueryModify(state: State) {
    let status = false
    const query = route.query
    for (const item in query) {
      if (query[item] !== state.query[item]) {
        status = true
      }
    }
    return status
  }
  // 页面跳转
  function _jump(to: string, query?: any) {
    chaoser.push({ path: route?.path + to, query })
  }
  // 事件监听
  function _on(callback: () => any, name?: string) {
    name = name || route?.path
    name && bus.on(name, callback)
    // onScopeDispose
    onScopeDispose(() => {
      name && bus.off(name)
    })
  }
  // 重置
  function _reset(state: State) {
    state.keepQuery = {}
    state.query = {}
    state.pages.pageNum = 1
    state.pages.pageSize = 20
  }

  return {
    state,
    add,
    batch,
    bindInstance,
    copy,
    created,
    edit,
    getData,
    getListParams,
    isSelected,
    operate,
    remove,
    removes,
    title,
    toggleRowSelection
  }
}

export default useLister
