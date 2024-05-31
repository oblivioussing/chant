<template>
  <div class="column-box">
    <role-tree ref="treeRef" @node-click="onNode"></role-tree>
    <div class="column-item flex-1">
      <chant-table2 v-model="state"></chant-table2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useLister } from 'chant'
import { columns } from './share'
import RoleTree from '@app-base/components/role-tree/index.vue'

// use
const lister = useLister()
// ref
const treeRef = ref()
// state
let state = reactive({
  ...lister.state,
  columns: columns()
})
// 获取列表
function getList() {
  lister.getData('role/router', state, { limit: false })
}
// tree节点
function onNode(row: { id: string }) {
  state.keepQuery.id = row.id
  // // 获取列表
  getList()
}
</script>

<style scoped lang="scss"></style>
