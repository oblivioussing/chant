<template>
  <chant-form
    v-model="state"
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
import { useFormer } from 'chant'
import type { FormProps, FormEmits } from 'chant/type'
import { columns } from '../share'

// props
const props = defineProps<FormProps>()
// emits
const emits = defineEmits<FormEmits>()
// use
const former = useFormer(props)
// state
let state = reactive({
  ...former.state
})
// create
former.created((status) => {
  // 获取详情
  status && getDetail()
}, state)
// 获取详情
function getDetail() {
  former.getData('position/detail', state)
}
// 保存
function onSave() {
  if (props.pageType === 'add') {
    state.form.orgId = state.selection.orgId
  }
  former.save(`position/${former.api}`, state)
}
</script>

<style scoped lang="scss"></style>
