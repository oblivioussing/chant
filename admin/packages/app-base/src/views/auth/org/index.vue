<template>
  <div class="column-box">
    <org-tree ref="treeRef" @node-click="onNode"></org-tree>
    <div class="column-item flex-1">
      <!-- search -->
      <chant-table-search v-model="state" :dict="dict" @query="getList">
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
          @edit="lister.edit(state, { id: $event.id })"
          @delete="onDelete($event.id)">
        </chant-column-operate>
      </chant-table>
    </div>
  </div>
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
import { onMounted, reactive, ref } from 'vue'
import { useLister } from 'chant'
import { columns, dict, type Model } from './share'
import MixForm from './components/MixForm.vue'
import OrgTree from './components/OrgTree.vue'

// use
const lister = useLister()
// ref
const treeRef = ref()
// state
let state = reactive({
  ...lister.state,
  columns: columns(),
  node: {} as Model
})
// onMounted
onMounted(() => {
  if (state.keepQuery.id) {
    // 获取列表
    getList()
  }
})
// 获取列表
function getList() {
  lister.getData('org/list', state, { limit: false })
}
// 新增
function onAdd() {
  lister.add(state, { id: state.node.id })
}
// 删除
function onDelete(id: string) {
  lister.remove('org/delete', state, { id })
}
// 批量删除
function onDeletes() {
  lister.removes('org/deletes', state)
}
// tree节点
function onNode(row: Model) {
  state.node = row
  state.keepQuery.parentId = row.id
  // 获取列表
  getList()
}
</script>

<style scoped lang="scss"></style>
