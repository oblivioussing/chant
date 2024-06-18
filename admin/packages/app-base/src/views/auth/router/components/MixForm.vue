<template>
  <chant-form
    v-model="state"
    :dict="newDict"
    :columns="columns()"
    @instance="former.bindInstance">
    <!-- 图标 -->
    <template #icon>
      <chant-icon-picker v-model="state.form.icon"></chant-icon-picker>
    </template>
  </chant-form>
  <chant-form-footer
    v-model="state"
    @close="former.close(state, emits)"
    @save="onSave">
  </chant-form-footer>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { reactive } from 'vue'
import { shiki, useFormer } from 'chant'
import type { FormProps, FormEmits } from 'chant/type'
import { columns, dict, type Model } from '../share'

// props
const props = defineProps<FormProps>()
// emits
const emits = defineEmits<FormEmits>()
// use
const former = useFormer(props)
// var
const newDict = cloneDeep(dict)
newDict.type = { 4: '页面', 5: '功能' } as any
// state
let state = reactive({
  ...former.state,
  form: {} as Model
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
  former.getData('router/detail', state)
}
// 获取父节点
async function getParentNode() {
  const id = state.selection.id
  state.formLoading = true
  const { data } = await shiki.get('router/detail', { id })
  state.formLoading = false
  if (data) {
    state.form.parentId = id
    state.form.level = data.level + 1
    state.form.threeMenu = data.threeMenu || 0
  }
  const { level, threeMenu } = state.form
  if ((level === 3 && !threeMenu) || level === 4) {
    state.form.name = data.name
    state.form.path = data.path
    state.form.type = '4'
  }
}
// 保存
function onSave() {
  former.save(`router/${former.api}`, state)
}
</script>

<style scoped lang="scss"></style>
