<template>
  <!-- search -->
  <chant-table-search v-model="state" :dict="dict" @query="getList">
    <!-- 职位 -->
    <template #positionId>
      <position-select
        v-model="state.query.positionId"
        :org-id="state.query.orgId"
        @change="onPosition">
      </position-select>
    </template>
  </chant-table-search>
  <!-- operate -->
  <chant-table-operate
    v-model="state"
    :options="['add', 'delete']"
    @add="lister.add(state)"
    @delete="onDeletes">
  </chant-table-operate>
  <!-- table -->
  <chant-table v-model="state" :dict="dict">
    <!-- 操作 -->
    <chant-column-operate
      :options="['edit', 'delete']"
      @edit="lister.edit(state, { id: $event.id })"
      @delete="onDelete($event.id)">
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
import { columns, dict } from './share'
import MixForm from './components/MixForm.vue'
import PositionSelect from './components/PositionSelect.vue'

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
  lister.getData('user/list', state)
}
// 删除
function onDelete(id: string) {
  lister.remove('user/delete', state, { id })
}
// 批量删除
function onDeletes() {
  lister.removes('user/deletes', state)
}
// 职位
function onPosition() {
  state.pages.pageNum = 1
  getList()
}
</script>

<style scoped lang="scss"></style>
