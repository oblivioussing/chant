<template>
  <div class="column-box">
    <role-tree ref="treeRef" @node-click="onNode"></role-tree>
    <div class="column-item flex-1">
      <chant-table2 v-model="state" slot-row>
        <!-- row -->
        <template #row="data">
          <Row v-bind="data"></Row>
        </template>
        <!-- 一级菜单 -->
        <template #first="{ rowData, column }">
          <div class="cell-box">{{ rowData[column.prop].name }}</div>
        </template>
        <!-- 二级级菜单 -->
        <template #second="{ rowData, column }">
          <div class="cell-box">{{ rowData[column.prop]?.name }}</div>
        </template>
        <!-- 三级级菜单 -->
        <template #third="{ rowData, column }">
          <div class="cell-box">{{ rowData[column.prop]?.name }}</div>
        </template>
        <!-- 功能 -->
        <template #funs="{ rowData, column }">
          <div class="cell-box">
            {{ rowData[column.prop]?.map((item:any)=>item.name).toString() }}
          </div>
        </template>
      </chant-table2>
      <!-- <div>123</div> -->
    </div>
  </div>
</template>

<script setup lang="tsx">
import { cloneVNode, reactive, ref } from 'vue'
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
const rowSpanIndex = 0
function Row({ rowData, rowIndex, cells, columns }: any) {
  const rowSpan = columns[rowSpanIndex].rowSpan({ rowData, rowIndex })
  if (rowSpan > 1) {
    const cell = cells[rowSpanIndex]
    const style = {
      ...cell.props.style,
      backgroundColor: 'var(--el-color-primary-light-3)',
      height: `${rowSpan * 50 - 1}px`,
      alignSelf: 'flex-start',
      zIndex: 1
    }
    cells[rowSpanIndex] = cloneVNode(cell, { style })
  }
  return cells
}
</script>

<style scoped lang="scss">
.cell-box {
  min-height: 32px;
}
</style>
