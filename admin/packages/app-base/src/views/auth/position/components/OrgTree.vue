<template>
  <div class="tree-box">
    <div class="toolbar">
      <el-input
        v-model="state.query.name"
        clearable
        placeholder="组织名称"
        @keyup.enter="getList">
      </el-input>
    </div>
    <div v-loading="state.loading" class="tree-container" ref="scrollRef">
      <el-tree
        :expand-on-click-node="false"
        :data="state.list"
        default-expand-all
        highlight-current
        :indent="10"
        node-key="id"
        :props="{ label: 'name' }"
        ref="treeRef"
        @node-click="onNode">
      </el-tree>
    </div>
  </div>
  <!-- mix-form -->
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
import { type TreeInstance } from 'element-plus'
import { onActivated, reactive, ref } from 'vue'
import { useScroll } from '@vueuse/core'
import { useLister } from 'chant'
import { type Model } from '../share'
import MixForm from './MixForm.vue'

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
  await lister.getData('org/tree', state, { limit: false })
  const list = state.list
  if (list.length) {
    const row = state.node.id ? state.node : list[0]
    emits('node-click', row)
    treeRef.value?.setCurrentNode(row)
  }
}
// 节点点击
function onNode(row: Model) {
  state.node = row
  emits('node-click', row)
}
</script>

<style scoped lang="scss">
.tree-container {
  width: 300px;
}
</style>
