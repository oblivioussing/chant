<template>
  <div class="column-box">
    <role-tree ref="treeRef" @node-click="onNode"></role-tree>
    <div class="column-item flex-1">
      <chant-table2 v-model="state"></chant-table2>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { useLister, type Column } from 'chant'
import RoleTree from '@app-base/components/role-tree/index.vue'
// import FunChecked from './components/FunChecked.vue'

// use
const lister = useLister()
// ref
const treeRef = ref()
// var
const columns = [
  {
    prop: 'first',
    label: '一级菜单',
    width: 144,
    cellRenderer(data) {
      return data.cellData?.name
    }
  },
  {
    prop: 'second',
    label: '二级菜单',
    width: 144,
    cellRenderer(data) {
      return data.cellData?.name
    }
  },
  {
    prop: 'third',
    label: '三级菜单',
    width: 144,
    cellRenderer(data) {
      return data.cellData?.name
    }
  },
  {
    prop: 'funs',
    label: '功能',
    cellRenderer(data) {
      return data.cellData?.map((item: any) => item.name)?.toString()
    }
  }
] as Column[]
// state
let state = reactive({
  ...lister.state,
  columns
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
