<template>
  <div class="column-box">
    <role-tree ref="treeRef" @node-click="onNode"></role-tree>
    <div class="column-item flex-1">
      <chant-table
        v-model="state"
        :show-selection="false"
        :span-method="spanMerge">
        <!-- 一级菜单 -->
        <template #first="{ row }">
          {{ row.first?.name }}
        </template>
        <!-- 二级级菜单 -->
        <template #second="{ row }">
          {{ row.second?.name }}
        </template>
        <!-- 三级级菜单 -->
        <template #third="{ row }">
          {{ row.third?.name }}
        </template>
        <!-- 功能 -->
        <template #funs="{ row }">
          {{ row.funs?.map((item:any) => item.name).toString() }}
        </template>
      </chant-table>
    </div>
  </div>
</template>

<script setup lang="tsx">
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
  columns: columns(),
  span1Arr: [] as number[], // 第一列合并规则
  span2Arr: [] as number[] // 第二列合并规则
})
// 获取列表
async function getList() {
  await lister.getData('role/router', state, { limit: false })
  // 获取合并数
  getSpanArr()
}
// tree节点
function onNode(row: { id: string }) {
  state.keepQuery.id = row.id
  // // 获取列表
  getList()
}
// 获取合并数
function getSpanArr() {
  let pos1 = 0
  let pos2 = 0
  state.list.forEach((item, index) => {
    if (index === 0) {
      state.span1Arr.push(1)
      state.span2Arr.push(1)
      return
    }
    if (item.first.id === state.list[index - 1].first.id) {
      state.span1Arr[pos1] += 1
      state.span1Arr.push(0)
    } else {
      pos1 = index
      state.span1Arr.push(1)
    }
    if (item.second.id === state.list[index - 1].second.id) {
      state.span2Arr[pos2] += 1
      state.span2Arr.push(0)
    } else {
      pos2 = index
      state.span2Arr.push(1)
    }
  })
}
// 行合并
function spanMerge({ rowIndex, columnIndex }: any) {
  if (state.span1Arr.length && columnIndex === 0) {
    const rowspan = state.span1Arr[rowIndex]
    const colspan = rowspan > 0 ? 1 : 0
    if (rowspan) {
      return { rowspan, colspan }
    }
    return { rowspan: 0, colspan: 0 }
  }
  if (state.span2Arr.length && columnIndex === 1) {
    const rowspan = state.span2Arr[rowIndex]
    const colspan = rowspan > 0 ? 1 : 0
    if (rowspan) {
      return { rowspan, colspan }
    }
    return { rowspan: 0, colspan: 0 }
  }
}
</script>

<style scoped lang="scss">
.cell-box {
  min-height: 32px;
}
</style>
