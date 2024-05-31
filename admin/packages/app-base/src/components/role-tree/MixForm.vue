<template>
  <chant-form
    v-model="state"
    :columns="columns"
    @instance="former.bindInstance">
  </chant-form>
  <chant-form-footer
    v-model="state"
    @close="former.close(state, emits)"
    @save="onSave">
  </chant-form-footer>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { shiki, useFormer } from 'chant'
import type { FormColumn as Column, FormProps, FormEmits } from 'chant/type'

// props
const props = defineProps<FormProps>()
// emits
const emits = defineEmits<FormEmits>()
// use
const former = useFormer(props)
// var
const columns = [
  {
    prop: 'name',
    label: '名称',
    required: true
  }
] as Column[]
// state
let state = reactive({
  ...former.state
})
// create
former.created((status) => {
  // 新增
  if (props.pageType === 'add') {
    // 获取父节点
    getParentNode()
  }
  // 获取详情
  status && getDetail()
}, state)
// 获取详情
function getDetail() {
  former.getData('role/detail', state)
}
// 获取父节点
async function getParentNode() {
  const id = state.selection.id
  state.formLoading = true
  const { data } = await shiki.get('role/detail', { id })
  state.formLoading = false
  if (data) {
    state.form.parentId = id
    state.form.level = data.level + 1
  }
}
// 保存
function onSave() {
  const map = {
    add: 'role/add',
    edit: 'role/update'
  } as any
  const path = map[props.pageType]
  former.save(path, state)
}
</script>

<style scoped lang="scss"></style>
