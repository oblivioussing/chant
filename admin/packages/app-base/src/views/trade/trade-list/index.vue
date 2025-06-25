<template>
  <!-- search -->
  <chant-table-search
    v-model="state"
    :dict="dict"
    :lang="lang"
    @query="getList">
  </chant-table-search>
  <!-- operate -->
  <chant-table-operate
    v-model="state"
    :lang="lang"
    :options="['add', 'set', 'delete', 'more']"
    show-checked-all
    @add="lister.add(state)"
    @set="onSet"
    @delete="onDeletes"
    @more="onMore">
    <template #edit-option>
      <el-dropdown-item command="status">状态</el-dropdown-item>
      <el-dropdown-item command="void">作废</el-dropdown-item>
    </template>
    <template #more-option>
      <el-dropdown-item command="export">导出</el-dropdown-item>
    </template>
  </chant-table-operate>
  <!-- table -->
  <chant-table v-model="state" :dict="dict" :lang="lang">
    <!-- 操作 -->
    <chant-column-operate
      :options="['edit', 'copy', 'delete']"
      @edit="lister.edit(state, { id: $event.id })"
      @copy="lister.copy(state, { id: $event.id })"
      @delete="onDelete($event.id)">
      <template #default="{ row }">
        <!-- more -->
        <chant-more-dropdown @command="onColumnMore($event, row)">
          <el-dropdown-item command="status">状态</el-dropdown-item>
          <el-dropdown-item command="void">作废</el-dropdown-item>
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
  <!-- mix-form -->
  <chant-dialog v-model="state.mixForm" :title="lister.title(state)">
    <mix-form
      v-if="state.mixForm"
      :copy-flag="state.copyFlag"
      :page-type="state.pageType"
      :selection="state.selection"
      @close="state.mixForm = false">
    </mix-form>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useLister } from 'chant'
import { columns, dict, lang } from './share'
import MixForm from './components/MixForm.vue'

// use
const lister = useLister()
// state
let state = reactive({
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
  lister.getData('trade/list', state)
}
// 更多操作column
function onColumnMore(type: string, row: any) {
  console.log(type, row)
}
// 删除
function onDelete(id: string) {
  lister.remove('trade/delete', state, { id })
}
// 批量删除
function onDeletes() {
  lister.removes('trade/deletes', state)
}
// 更多操作
function onMore(type: string) {
  console.log(type)
}
// 批量设置
function onSet(val: string) {
  console.log(val)
}
</script>

<style scoped lang="scss"></style>
