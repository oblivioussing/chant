<template>
  <div class="column-box">
    <router-tree ref="treeRef" @node-click="onNode"></router-tree>
    <div class="column-item flex-1">
      <!-- search -->
      <chant-table-search v-model="state" :dict="dict" @query="getList">
      </chant-table-search>
      <!-- operate -->
      <chant-table-operate v-model="state" :options="['add']" @add="onAdd">
        <!-- 转移 -->
        <chant-icon-button
          content="转移"
          icon-type="switch"
          @click="state.transfer = true">
        </chant-icon-button>
        <!-- 保存排序 -->
        <chant-icon-button
          :content="gt('button.sort')"
          icon-type="sort"
          @click="onSort">
        </chant-icon-button>
      </chant-table-operate>
      <!-- table -->
      <chant-table v-model="state" :dict="dict" sort>
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
  <!-- 转移 -->
  <chant-dialog v-model="state.transfer" style="width: 600px" title="路由转移">
    <router-transfer v-if="state.transfer" @close="state.transfer = false">
    </router-transfer>
  </chant-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { shiki, useLister } from 'chant'
import { columns, dict, type Model } from './share'
import MixForm from './components/MixForm.vue'
import RouterTransfer from './components/RouterTransfer.vue'
import RouterTree from './components/RouterTree.vue'

// use
const { t: gt } = useI18n({ useScope: 'global' })
const lister = useLister()
// ref
const treeRef = ref()
// state
let state = reactive({
  ...lister.state,
  columns: columns(),
  node: {} as Model,
  transfer: false
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
  lister.getData('router/list', state, { limit: false })
}
// 新增
function onAdd() {
  lister.add(state, { id: state.node.id })
}
// 删除
function onDelete(id: string) {
  lister.remove('router/delete', state, { id })
}
// 保存排序
async function onSort() {
  const ids = state.list.map((item) => item.id)
  const { code } = await shiki.post('router/sort', { ids })
  if (code === '1') {
    treeRef.value?.getList()
  }
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
