<template>
  <chant-form
    v-model="state"
    :columns="columns()"
    :dict="dict"
    :page-type="props.type"
    @instance="former.bindInstance">
  </chant-form>
  <chant-form-footer v-model="state" @save="onSave"></chant-form-footer>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useFormer } from '@/use'
import { columns, dict } from '../share'

// props
const props = defineProps<{
  type: 'add' | 'edit'
}>()
// use
const former = useFormer()
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
  former.getData('user/detail', state)
}
// 保存
function onSave() {
  const map = {
    add: 'user/add',
    edit: 'user/update'
  }
  former.save(map[props.type], state)
}
</script>

<style scoped lang="scss"></style>
