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
    :options="['add', 'delete']"
    show-checked-all
    split-button
    @add="lister.add(state)"
    @delete="onDeletes">
  </chant-table-operate>
  <!-- table -->
  <chant-table v-model="state" :dict="dict" sort>
    <!-- 操作 -->
    <chant-column-operate :width="140">
      <template #="{ row }">
        <!-- 编辑 -->
        <chant-button link @click="lister.edit(state, row)">编辑</chant-button>
        <!-- 复制 -->
        <chant-button link @click="lister.copy(state, row)">复制</chant-button>
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
  <!-- 新增/编辑 -->
  <chant-dialog v-model="state.editVisible" :title="lister.title(state)">
    <add-edit
      v-if="state.editVisible"
      :copy-flag="state.copyFlag"
      :page-type="state.editType"
      :selection="state.selection"
      @close="state.editVisible = false">
    </add-edit>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useLister } from '@/use'
import { columns, dict } from './share'
import AddEdit from './components/AddEdit.vue'

// use
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns: columns()
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
// 删除
function onDelete({ id }: any) {
  lister.remove('user/delete', state, { id })
}
// 批量删除
function onDeletes() {
  lister.removes('user/deletes', state)
}
// 批量修改command
function onCommand(val: any) {
  console.log(val)
}
</script>

<style scoped lang="scss"></style>
