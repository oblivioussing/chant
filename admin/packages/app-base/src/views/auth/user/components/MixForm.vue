<template>
  <chant-form
    v-model="state"
    :columns="columns()"
    :dict="dict"
    @instance="former.bindInstance">
    <!-- 职位 -->
    <template #positionId>
      <position-select
        v-model="state.form.positionId"
        :disabled="!state.form.orgId"
        :org-id="state.form.orgId">
      </position-select>
    </template>
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
import { useFormer } from 'chant'
import type { FormProps, FormEmits } from 'chant/type'
import { columns, dict } from '../share'
import PositionSelect from './PositionSelect.vue'
import RoleTreeSelect from '@app-base/views/auth/components/RoleTreeSelect.vue'

// props
const props = defineProps<FormProps>()
// emits
const emits = defineEmits<FormEmits>()
// use
const former = useFormer(props, { columns: columns() })
// state
let state = reactive({
  ...former.state,
  orgTree: []
})
// create
former.created(async (status) => {
  // 获取详情
  status && getDetail()
}, state)
// 获取详情
function getDetail() {
  former.getData('user/detail', state)
}
// 保存
function onSave() {
  former.save(`user/${former.api}`, state)
}
</script>

<style scoped lang="scss"></style>
