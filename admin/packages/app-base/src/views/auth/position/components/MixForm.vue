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
import { columns } from '../share'
import RoleTreeSelect from '@app-base/views/auth/components/RoleTreeSelect.vue'

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
  // 获取组织详情
  if (props.pageType === 'add') {
    getOrgDetail()
  }
}, state)
// 获取详情
function getDetail() {
  former.getData('position/detail', state)
}
// 获取组织详情
async function getOrgDetail() {
  const id = state.selection.orgId
  const { data } = await shiki.get('org/detail', { id })
  state.form.roleIds = data?.roleIds
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
