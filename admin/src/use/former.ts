import type { FormInstance } from 'element-plus'
import { getCurrentInstance, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import shiki from '@/api/shiki'
import { type FormState as State } from '@/chant'
import { ApiCode } from '@/enum'
import { bus, core } from '@/utils'

type Config = { type?: 'page' | 'dialog' | 'inline' }

function useFormer(config = { type: 'page' } as Config) {
  let formInstance: FormInstance
  const instance = getCurrentInstance()
  const route = useRoute()
  const state = {
    continueAdd: false,
    copyAddFlag: '0' as '0' | '1',
    form: {} as any,
    formLoading: false,
    loading: false,
    query: {} as any
  }

  // 绑定表单实例
  function bindInstance(val: FormInstance) {
    formInstance = val
  }
  // 初始化
  function created(callback: (_: boolean) => void, state: State) {
    state.query = route?.query
    callback(_hasGetDetail())
    // onActivated
    onActivated(() => {
      // 路由参数是否变化
      const isModify = _isRouterQueryModify(state)
      if (isModify) {
        state.query = route?.query
        callback(_hasGetDetail())
      }
    })
  }
  // 获取数据
  async function getData(path: string, state: State) {
    state.formLoading = true
    const { data } = await shiki?.get(path, state.query)
    state.formLoading = false
    state.form = data || {}
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
    if (config.type === 'page') {
      // 刷新列表
      const path = core.getParentPath(route?.path)
      bus.emit(path)
      // 关闭页面
      core.closePage()
    } else if (config.type === 'dialog') {
      const emitsOptions = (instance as any)?.emitsOptions
      if (emitsOptions?.hasOwnProperty('update')) {
        instance?.emit('update')
      }
      instance?.emit('update:modelValue', false)
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
      }
    }
    return status
  }
  // 是否需要获取详情
  function _hasGetDetail() {
    const copyAddFlag = route.query['copy-add-flag']
    const props = instance?.props
    return copyAddFlag === '1' || props?.type === 'edit'
  }

  return {
    state,
    bindInstance,
    created,
    getData,
    save
  }
}

export default useFormer
