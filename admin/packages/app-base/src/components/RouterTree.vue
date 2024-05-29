<template>
  <div class="tree-box">
    <div class="toolbar">
      <el-input
        v-model="state.query.name"
        clearable
        placeholder="路由名称"
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
        node-key="id"
        ref="treeRef"
        @node-click="onNode">
        <template #default="{ data }">
          <div class="tree-item">
            <div>{{ data.name }}</div>
            <div class="button-box">
              <!-- 新增 -->
              <el-button
                v-if="showAdd(data)"
                :icon="Plus"
                link
                type="primary"
                @click="onAdd(data)">
              </el-button>
              <!-- 编辑 -->
              <el-button
                :icon="Edit"
                link
                type="primary"
                @click.stop="lister.edit(state, data)">
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
  <!-- 新增/编辑 -->
  <chant-dialog v-model="state.mixForm" :title="lister.title(state)">
    <mix-form
      v-if="state.mixForm"
      :page-type="state.pageType"
      :selection="state.selection"
      @close="state.mixForm = false">
    </mix-form>
  </chant-dialog>
</template>

<script setup lang="ts">
import { onActivated, reactive, ref } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { useScroll } from '@vueuse/core'
import { shiki, useLister } from 'chant'
import { type Model } from '@app-base/views/auth/router/share'
import MixForm from '@app-base/views/auth/router/components/MixForm.vue'

// defineExpose
defineExpose({
  getList // 获取列表
})
// emits
const emits = defineEmits(['node-click'])
// ref
const scrollRef = ref<HTMLElement | null>()
const treeRef = ref()
// use
const lister = useLister({ method: getList })
const { y } = useScroll(scrollRef)
// state
let state = reactive({
  ...lister.state,
  node: {} as Model
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
  await lister.getData('router/tree', state, { limit: false })
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
  const { code } = await shiki.post('router/root', {})
  state.loading = false
  if (code === '1') {
    getList()
  }
}
// 是否显示新增按钮
function showAdd(row: Model) {
  if (row.level === 2) {
    return row.threeMenu
  }
  return row.level !== 3
}
// 节点点击
function onNode(row: Model) {
  state.node = row
  emits('node-click', row)
}
// 新增
function onAdd(row: Model) {
  state.selection = row
  state.pageType = 'add'
  state.mixForm = true
}
// 删除
function onDelete(row: Model) {
  state.node = {} as Model
  lister.remove('router/deleteTree', state, { id: row.id })
}
</script>

<style scoped lang="scss">
.tree-container {
  width: 300px;
}
</style>
