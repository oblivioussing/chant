<template>
  <chant-form
    v-model="state"
    :columns="columns()"
    @instance="former.bindInstance">
    <!-- 角色 -->
    <template #roleIds>
      <role-tree-select v-model="state.form.roleIds"></role-tree-select>
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
import { shiki, useFormer } from 'chant'
import type { FormProps, FormEmits } from 'chant/type'
import { columns, type Model } from '../share'
import RoleTreeSelect from '@app-base/views/auth/components/RoleTreeSelect.vue'

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
    // 获取父节点
    getParentNode()
  }
  // 获取详情
  status && getDetail()
}, state)
// 获取详情
function getDetail() {
  former.getData('org/detail', state)
}
// 获取父节点
async function getParentNode() {
  const id = state.selection.id
  state.formLoading = true
  const { data } = await shiki.get('org/detail', { id })
  state.formLoading = false
  if (data) {
    state.form.parentId = id
    state.form.level = data.level + 1
  }
}
// 保存
function onSave() {
  former.save(`org/${former.api}`, state)
}
</script>

<style scoped lang="scss"></style>
