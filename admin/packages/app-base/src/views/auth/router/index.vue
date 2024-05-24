<template>
  <div class="column-box">
    <router-tree @node-click="onNode"></router-tree>
    <div class="column-item flex-1">
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
        @add="onAdd"
        @delete="onDeletes">
      </chant-table-operate>
      <!-- table -->
      <chant-table v-model="state" :dict="dict">
        <!-- 操作 -->
        <chant-column-operate
          :options="['edit', 'delete']"
          @edit="lister.edit(state, $event)"
          @delete="onDelete($event)">
        </chant-column-operate>
      </chant-table>
    </div>
  </div>
  <!-- 新增/编辑 -->
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
import { columns, dict, type Model } from './share'
import MixForm from './components/MixForm.vue'
import RouterTree from '@app-base/components/RouterTree.vue'

// use
const lister = useLister()
// state
let state = reactive({
  ...lister.state,
  columns: columns(),
  node: {} as Model
})
// created
lister.created(() => {
  if (state.query.id) {
    // 获取列表
    getList()
  }
})
// 获取列表
function getList() {
  lister.getData('router/list', state, { limit: false })
}
// 新增
function onAdd() {
  const { id, level, threeLevel } = state.node
  lister.jump('/add', { id, level, threeLevel })
}
// 删除
function onDelete({ id }: Model) {
  lister.remove('router/delete', state, { id })
}
// 批量删除
function onDeletes() {
  lister.removes('router/deletes', state)
}
// tree节点
function onNode(row: Model) {
  state.node = row
  state.query.id = row.id
  // 获取列表
  getList()
}
</script>

<style scoped lang="scss"></style>
