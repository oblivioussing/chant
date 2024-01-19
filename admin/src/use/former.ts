import type { FormInstance } from 'element-plus'
import { getCurrentInstance, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import shiki from '@/api/shiki'
import type { FormState as State, FormType } from '@/chant'
import { ApiCode } from '@/enum'
import type { FormProps } from '@/type'
import { bus, core } from '@/utils'

function useFormer(config: FormProps) {
  let formInstance: FormInstance
  const instance = getCurrentInstance()
  const route = useRoute()

  const state = {
    continueAdd: false,
    copyFlag: config.copyFlag as 0 | 1,
    form: {} as any,
    formLoading: false,
    loading: false,
    pageType: config.pageType,
    query: {} as any,
    selection: config.selection as { id: string },
    type: config.type || 'dialog'
  }
  // 绑定表单实例
  function bindInstance(val: FormInstance) {
    formInstance = val
  }
  // 关闭
  function close(state: State, emits: (evt: 'close') => void) {
    if (state.type === 'page') {
      core.closePage()
    } else {
      emits('close')
    }
  }
  // 初始化
  function created(callback: (_: boolean) => void, state: State) {
    if (state.type === 'page') {
      state.query = route?.query
      // onActivated
      onActivated(() => {
        // 路由参数是否变化
        const isModify = _isRouterQueryModify(state)
        if (isModify) {
          state.query = route?.query
          callback(_hasGetDetail(state))
        }
      })
    } else {
      state.query = { id: state.selection.id }
    }
    callback(_hasGetDetail(state))
  }
  // 获取数据
  async function getData(path: string, state: State) {
    state.formLoading = true
    const { data } = await shiki?.get(path, state.query)
    state.formLoading = false
    state.form = data || {}
    if (state.copyFlag) {
      state.form.id = undefined
    }
  }
  // 保存
  async function save(path: string, state: State, row?: { params?: any }) {
    // 表单校验
    const status = await validate()
    if (!status) {
      return false
    }
    const params = row?.params || state.form
    state.loading = true
    const { code } = await shiki?.post(path, params)
    state.loading = false
    if (code !== ApiCode.Success) {
      return false
    }
    // 是否继续新增
    if (state.continueAdd) {
      state.form = {}
      formInstance.resetFields()
      return true
    }
    if (config.type === 'dialog') {
      instance?.emit('update')
      instance?.emit('close')
      // 刷新列表
      bus.emit(route.path)
    } else {
      // 关闭页面
      config.type === 'page' && core.closePage()
      // 刷新列表
      const parentPath = core.getParentPath(route?.path)
      bus.emit(parentPath)
    }
    return true
  }
  // 表单校验
  async function validate() {
    let status
    try {
      status = await formInstance.validate()
    } catch (error) {
      console.error(error)
    }
    return status
  }
  // 路由参数是否变化
  function _isRouterQueryModify(state: State) {
    let status = false
    const query = route.query
    for (let item in query) {
      if (query[item] !== state.query[item]) {
        status = true
        break
      }
    }
    return status
  }
  // 是否需要获取详情
  function _hasGetDetail(state: State) {
    let copyFlag: any = state.copyFlag
    if (state.type === 'page') {
      copyFlag = Number(route.query.copyFlag)
    }
    return copyFlag || state.pageType === 'edit'
  }

  return {
    state,
    bindInstance,
    close,
    created,
    getData,
    save
  }
}

export default useFormer
