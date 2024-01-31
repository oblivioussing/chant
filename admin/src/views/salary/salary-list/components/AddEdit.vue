<template>
  <chant-form
    v-model="state"
    :dict="dict"
    :columns="columns()"
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
import type { FormProps, FormEmits } from '@/type'
import { useFormer } from '@/use'
import { columns, dict } from '../share'

// props
const props = defineProps<FormProps>()
// emits
const emits = defineEmits<FormEmits>()
// use
const former = useFormer(props)
// state
const state = reactive({
  ...former.state
})
// create
former.created((status) => {
  // 获取详情
  status && getDetail()
}, state)
// 获取详情
function getDetail() {
  former.getData('salary/detail', state)
}
// 保存
function onSave() {
  const map = {
    add: 'salary/add',
    edit: 'salary/update'
  }
  const path = map[props.pageType]
  former.save(path, state)
}
</script>

<style scoped lang="scss"></style>
