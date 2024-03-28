<template>
  <!-- search -->
  <chant-table-search
    v-model="state"
    :dict="dict"
    :lang="lang"
    @query="getList"
    @reset="getList">
  </chant-table-search>
  <!-- operate -->
  <chant-table-operate
    v-model="state"
    :options="['add', 'delete']"
    :lang="lang"
    show-checked-all
    split-button
    @add="lister.add(state)"
    @delete="onDeletes">
  </chant-table-operate>
  <!-- table -->
  <chant-table v-model="state" :dict="dict" :lang="lang">
    <!-- 操作 -->
    <chant-column-operate
      :options="['edit', 'delete']"
      @edit="lister.edit(state, $event)"
      @delete="onDelete($event)">
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
      :edit-type="state.editType"
      :selection="state.selection"
      @close="state.editVisible = false">
    </add-edit>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import lang from '@/lang/user'
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
</script>

<style scoped lang="scss"></style>
