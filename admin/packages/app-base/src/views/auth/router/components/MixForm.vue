<template>
  <chant-form
    v-model="state"
    :dict="dict"
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
import { reactive } from 'vue'
import { useFormer } from 'chant'
import type { FormProps, FormEmits } from 'chant/type'
import { columns, dict, type Model } from '../share'

// props
const props = defineProps<FormProps>()
// emits
const emits = defineEmits<FormEmits>()
// use
const former = useFormer(props)
// state
let state = reactive({
  ...former.state,
  form: {} as Model
})
// create
former.created((status) => {
  // 新增
  if (props.pageType === 'add') {
    state.form.parentId = state.selection.id
    state.form.level = Number(state.selection.level) + 1
  }
  // 获取详情
  status && getDetail()
}, state)
// 获取详情
function getDetail() {
  former.getData('router/detail', state)
}
// 保存
function onSave() {
  const map = {
    add: 'router/add',
    edit: 'router/update'
  } as any
  const path = map[props.pageType]
  former.save(path, state)
}
</script>

<style scoped lang="scss"></style>
