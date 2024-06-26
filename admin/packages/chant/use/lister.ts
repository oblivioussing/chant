import { type TableInstance } from 'element-plus'
import { onActivated, onScopeDispose } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { bus, element, shiki, useChaoser } from '@chant'
import type { ListState as State, FormType, PageType } from '@chant/type'

function useLister(config?: { method?: Function; type?: FormType }) {
  const chaoser = useChaoser()
  const { t: gt } = useI18n({ useScope: 'global' })
  const route = useRoute()
  const state = {
    all: 0 as 0 | 1,
    columns: [],
    copyFlag: 0 as 0 | 1,
    extra: {} as any,
    formType: config?.type || 'dialog',
    keepQuery: {} as any,
    list: [] as any[],
    loading: false,
    mixForm: false,
    pages: { pageNum: 1, pageSize: 20 },
    pageType: '' as PageType,
    pickerText: {} as any,
    query: {} as any,
    selection: {} as any,
    selections: [] as any[],
    total: 0
  }
  const meta = chaoser.getMetaByPath()
  const funs = meta?.funs as string[] | undefined
  const method = config?.method
  let tableInstance: TableInstance

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
    const count = params.all ? state.total : state.selections.length
    const title = gt('tips.totalRecords', [count])
    operate(path, state, { confirmTip, params, title })
  }
  // 绑定列表实例
  function bindInstance(val: TableInstance) {
    tableInstance = val
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
  // 新增
  function add(state: State, row?: any) {
    _pageHandle(state, { type: 'add' }, row)
  }
  // 复制新增
  function copy(state: State, row: any) {
    _pageHandle(state, { type: 'add', copyFlag: 1 }, row)
  }
  // 编辑
  function edit(state: State, row: any) {
    _pageHandle(state, { type: 'edit' }, row)
  }
  // 详情
  function detail(state: State, row: any) {
    _pageHandle(state, { type: 'detail' }, row)
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
    state.loading = false
    // 返回数据
    if (config?.custom) {
      return data
    }
    // 数据处理
    dataDeal(state, data, config?.limit)
  }
  // 数据处理
  function dataDeal(state: State, data?: any, limit?: boolean) {
    if (data) {
      if (limit !== false) {
        state.list = data?.list || []
        state.total = data?.total || 0
        state.extra = data?.extra || {}
      } else {
        state.list = data as any
      }
    } else {
      state.list = []
    }
  }
  // 获取查询参数
  function getQuery(state: State) {
    const query = { ...state.keepQuery, ...state.query }
    return query
  }
  // 获取列表参数
  function getListParams(state: State) {
    return {
      ids: state.selections.map((item) => item.id),
      all: state.all,
      search: getQuery(state)
    }
  }
  // 是否选中数据
  function isSelected(state: State) {
    return state.selections.length > 0 || state.all === 1
  }
  // 页面跳转
  function jump(to: string, query?: any) {
    const path = route.path + to
    chaoser.push({ path, query })
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
    if (code === '1') {
      method ? method() : bus.emit(route.path)
    }
  }
  // 权限校验
  function permission(val: string) {
    return funs?.includes(val)
  }
  // 删除
  function remove(path: string, state: State, params: any) {
    operate(path, state, {
      confirmTip: gt('tips.confirmDelete'),
      params
    })
  }
  // 批量删除
  function removes(path: string, state: State) {
    batch(path, state, { confirmTip: gt('tips.confirmBatchDelete') })
  }
  // 标题
  function title(state: State) {
    const path = `${route.path}/${state.pageType}`
    const meta = chaoser.getMetaByPath(path)
    if (meta?.title) {
      return meta.title
      // return gt(`router.${meta?.title}`)
    } else {
      return ''
    }
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
  // 事件监听
  function _on(callback: () => any, name?: string) {
    name = name || route?.path
    name && bus.on(name, callback)
    // onScopeDispose
    onScopeDispose(() => {
      name && bus.off(name)
    })
  }
  // 页面处理
  function _pageHandle(
    state: State,
    config: {
      type: PageType
      copyFlag?: 0 | 1
    },
    params = {}
  ) {
    if (state.formType === 'page') {
      const copyFlag = config.copyFlag
      jump(`/${config.type}`, { ...params, copyFlag })
    } else {
      state.selection = params
      state.pageType = config.type
      state.mixForm = true
      state.copyFlag = config.copyFlag
    }
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
    detail,
    getData,
    getListParams,
    isSelected,
    jump,
    operate,
    permission,
    remove,
    removes,
    title,
    toggleRowSelection
  }
}

export default useLister
