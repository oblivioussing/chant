<template>
  <div class="tree-box">
    <div class="toolbar">
      <el-input
        v-model="state.query.name"
        clearable
        placeholder="角色名称"
        @keyup.enter="getList">
      </el-input>
    </div>
    <div v-loading="state.loading" class="tree-container" ref="scrollRef">
      <el-tree
        v-if="state.list.length"
        v-bind="$attrs"
        :expand-on-click-node="false"
        :data="state.list"
        default-expand-all
        highlight-current
        :indent="10"
        node-key="id"
        ref="treeRef"
        @node-click="onNode">
        <template #default="{ data }">
          <div class="tree-item">
            <div>{{ data.name }}</div>
            <div class="button-box">
              <!-- 新增 -->
              <el-button :icon="Plus" link type="primary" @click="onAdd(data)">
              </el-button>
              <!-- 编辑 -->
              <el-button
                :icon="Edit"
                link
                type="primary"
                @click.stop="onEdit(data)">
              </el-button>
              <!-- 删除 -->
              <el-button
                :icon="Delete"
                link
                type="danger"
                @click.stop="onDelete(data)">
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>
      <el-button
        v-else-if="!state.loading"
        type="primary"
        class="gravity-center"
        @click="onRoot">
        初始化
      </el-button>
    </div>
  </div>
  <!-- mix-form -->
  <chant-dialog v-model="state.mixForm" :title="state.title">
    <mix-form
      v-if="state.mixForm"
      :page-type="state.pageType"
      :selection="state.selection"
      @close="state.mixForm = false">
    </mix-form>
  </chant-dialog>
</template>

<script setup lang="ts">
import { type TreeInstance } from 'element-plus'
import { onActivated, reactive, ref } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { useScroll } from '@vueuse/core'
import { shiki, useLister } from 'chant'
import MixForm from './MixForm.vue'

// defineExpose
defineExpose({
  getList // 获取列表
})
// emits
const emits = defineEmits(['node-click'])
// ref
const scrollRef = ref<HTMLElement | null>()
const treeRef = ref<TreeInstance>()
// use
const lister = useLister({ method: getList })
const { y } = useScroll(scrollRef)
// state
let state = reactive({
  ...lister.state,
  node: {} as any,
  title: ''
})
// onMounted
lister.created(() => {
  // 获取列表
  getList()
})
// onActivated
onActivated(() => {
  scrollRef.value!.scrollTo({ top: y.value })
})
// 获取列表
async function getList() {
  await lister.getData('role/tree', state, { limit: false })
  const list = state.list
  if (list.length) {
    const row = state.node.id ? state.node : list[0]
    emits('node-click', row)
    treeRef.value?.setCurrentNode(row)
  }
}
// 初始化
async function onRoot() {
  state.loading = true
  const { code } = await shiki.post('role/root', {})
  state.loading = false
  if (code === '1') {
    getList()
  }
}
// 节点点击
function onNode(row: any) {
  state.node = row
  emits('node-click', row)
}
// 新增
function onAdd(row: any) {
  state.title = '角色新增'
  state.selection = row
  state.pageType = 'add'
  state.mixForm = true
}
// 编辑
function onEdit(row: any) {
  state.title = '角色编辑'
  lister.edit(state, row)
}
// 删除
function onDelete(row: any) {
  state.node = {}
  lister.remove('role/delete', state, { id: row.id })
}
</script>

<style scoped lang="scss">
.tree-container {
  width: 300px;
}
</style>
