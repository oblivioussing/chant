import { type TableInstance } from 'element-plus'
import { nextTick, onActivated, onScopeDispose } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { shiki } from '@/api'
import { type ListState as State } from '@/chant'
import { ApiCode } from '@/enum'
import { element } from '@/plugs'
import { useAppStore } from '@/store'
import { bus } from '@/utils'

function useLister() {
  const appStore = useAppStore()
  const route = useRoute()
  const router = useRouter()
  const state = {
    allFlag: 0 as 0 | 1,
    columns: [],
    extra: {} as Record<string, any>,
    keepQuery: {} as Record<string, any>,
    lang: {},
    list: [] as any[],
    loading: false,
    pages: { pageNum: 1, pageSize: 20 },
    query: {} as Record<string, any>,
    selection: [] as any[],
    total: 0
  }
  let tableInstance: TableInstance

  // 新增
  function add() {
    // 页面跳转
    _jump('/add')
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
    const title = params.allFlag ? '当前操作影响所有记录' : ''
    operate(path, state, { confirmTip, params, title })
  }
  // 批量删除
  function batchRemove(path: string, state: State) {
    batch(path, state, { confirmTip: '确认批量删除?' })
  }
  // 绑定列表实例
  function bindInstance(val: TableInstance) {
    tableInstance = val
  }
  // 复制新增
  function copyAdd(row: any) {
    const query = { id: row.id, 'copy-add-flag': '1' }
    // 页面跳转
    _jump('/add', query)
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
  function edit(row: any) {
    const query = { id: row.id }
    // 页面跳转
    _jump('/edit', query)
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
    const { data } = await shiki?.get(path, query)
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
      idList: state.selection.map((item) => item.id),
      allFlag: state.allFlag,
      search: getQuery(state)
    }
  }
  // 是否选中数据
  function isSelected(state: State) {
    return state.selection.length > 0 || state.allFlag === 1
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
      confirmTip: '确认删除?',
      params
    })
  }
  // 切换某一行的选中状态
  function toggleRowSelection(row: any, selected: boolean) {
    tableInstance.toggleRowSelection(row, selected)
  }
  // 路由参数是否变化
  function _isRouterQueryModify(state: State) {
    let status = false
    const query = route.query
    for (let item in query) {
      if (query[item] !== state.query[item]) {
        status = true
      }
    }
    return status
  }
  // 页面跳转
  function _jump(to: string, query?: any) {
    const path = route?.path || ''
    const toPath = path?.replace('/index', to)
    appStore.updatePageRelation(toPath, path)
    router.push({ path: toPath, query })
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
    batchRemove,
    bindInstance,
    copyAdd,
    created,
    edit,
    getData,
    getListParams,
    isSelected,
    operate,
    remove,
    toggleRowSelection
  }
}

export default useLister
