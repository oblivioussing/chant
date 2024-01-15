<template>
  <!-- search -->
  <chant-table-search
    v-model="state"
    :dict="dict"
    @query="getList"
    @reset="getList">
  </chant-table-search>
  <!-- operate -->
  <chant-table-operate
    v-model="state"
    :options="['add', 'alter', 'delete']"
    show-checked-all
    split-button
    @add="lister.add"
    @alter="onAlter"
    @command="onCommand"
    @delete="onBatchDelete">
    <!-- 批量修改选项 -->
    <template #alter-option>
      <el-dropdown-item command="1">姓名</el-dropdown-item>
      <el-dropdown-item command="2">年龄</el-dropdown-item>
    </template>
  </chant-table-operate>
  <!-- table -->
  <chant-table v-model="state" :dict="dict" sort>
    <!-- 操作 -->
    <chant-column-operate :width="140">
      <template #="{ row }">
        <!-- 编辑 -->
        <chant-button link @click="lister.edit(row)">编辑</chant-button>
        <!-- 复制 -->
        <chant-button link @click="lister.copyAdd(row)">复制</chant-button>
        <!-- 删除 -->
        <chant-button link type="danger" @click="onDelete(row)">
          删除
        </chant-button>
        <!-- 更多 -->
        <chant-more-dropdown @command="onCommand">
          <el-dropdown-item command="1">action1</el-dropdown-item>
          <el-dropdown-item command="2">action2</el-dropdown-item>
        </chant-more-dropdown>
      </template>
    </chant-column-operate>
  </chant-table>
  <!-- pagination -->
  <chant-pagination
    v-model="state.pages"
    :total="state.total"
    @change="getList">
  </chant-pagination>
  <!-- 批量修改 -->
  <batch-alter v-if="state.batchAlterVisible" v-model="state.batchAlterVisible">
  </batch-alter>
</template>

<script setup lang="ts" name="/user/user-list/index">
import { reactive } from 'vue'
import { useLister } from '@/use'
import { columns, dict } from './share'
import BatchAlter from './components/BatchAlter.vue' // 批量修改

// use
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns: columns(),
  batchAlterVisible: false
})
// created
lister.created(() => {
  // 获取列表
  getList()
})
// 获取列表
function getList() {
  lister.getData('user/list', state)
}
// 批量删除
function onBatchDelete() {
  lister.batchRemove('xx/xx', state)
}
// 删除
function onDelete({ id }: any) {
  lister.remove('user/delete', state, { id })
}
// 批量修改
function onAlter() {
  state.batchAlterVisible = true
}
// 批量修改command
function onCommand(val: any) {
  console.log(val)
}
</script>

<style scoped lang="scss"></style>
