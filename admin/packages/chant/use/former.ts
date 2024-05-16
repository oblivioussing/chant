import type { FormInstance } from 'element-plus'
import { getCurrentInstance, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { base, bus, shiki, ApiCode } from '@chant'
import type { FormColumn, FormProps, FormState as State } from '@chant/type'

function useFormer(props: FormProps, config?: { columns?: FormColumn[] }) {
  let formInstance: FormInstance
  const instance = getCurrentInstance()
  const route = useRoute()
  const fileColumns = config?.columns?.filter((item) => {
    return (
      item.type === 'upload' &&
      ['file-list', 'picture-card'].includes(item.uploadType!)
    )
  })
  const state = {
    continueAdd: false,
    copyFlag: props.copyFlag as 0 | 1,
    form: {} as any,
    formLoading: false,
    hasFile: false,
    loading: false,
    pageType: props.pageType,
    query: {} as any,
    type: props.type || 'dialog'
  }
  // 绑定表单实例
  function bindInstance(val: FormInstance) {
    formInstance = val
  }
  // 关闭
  function close(state: State, emits: (evt: 'close') => void) {
    if (state.type === 'page') {
      base.closePage()
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
      state.query = { id: props?.selection?.id }
    }
    callback(_hasGetDetail(state))
  }
  // 获取数据
  async function getData(path: string, state: State) {
    state.formLoading = true
    const { data } = await shiki.get(path, state.query)
    state.formLoading = false
    state.form = data || {}
    if (state.copyFlag) {
      state.form.id = undefined
    }
    // 添加文件所需属性
    if (fileColumns) {
      fileColumns.forEach((item) => {
        const type = item.uploadType
        state.form[item.prop]?.forEach((item1: any) => {
          if (type === 'file-list') {
            item1.name = item1.filenameOriginal
          } else {
            item1.url = item1.filePath + item1.filename
          }
        })
      })
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
    // 上传文件
    if (fileColumns) {
      await _uploads(params)
    }
    const { code } = await shiki.post(path, params)
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
    if (state.type === 'dialog') {
      instance?.emit('update')
      instance?.emit('close')
      // 刷新列表
      bus.emit(route.path)
    } else if (state.type === 'page') {
      base.closePage()
      const parentPath = base.getParentPath(route?.path)
      bus.emit(parentPath)
    } else {
      bus.emit(route.path)
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
  // 上传文件
  async function _uploads(params: any) {
    for (const item of fileColumns!) {
      const fileList = params[item.prop] as { raw?: any }[]
      const list = [] as any[]
      const formData = new FormData()
      formData.append('fileBizType', item.fileBizType || '')
      fileList.forEach((item) => {
        if (item.raw) {
          formData.append('file', item.raw)
        } else {
          list.push(item)
        }
      })
      if (formData.get('file')) {
        const { data } = await shiki.post('fs/uploads', formData)
        params[item.prop] = list.concat(data)
      }
    }
  }
  // 路由参数是否变化
  function _isRouterQueryModify(state: State) {
    let status = false
    const query = route.query
    for (const item in query) {
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
    return copyFlag || ['detail', 'edit'].includes(state.pageType as string)
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
