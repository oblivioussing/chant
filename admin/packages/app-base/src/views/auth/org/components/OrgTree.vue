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
              <el-button :icon="Plus" link type="primary" @click="onAdd(data)">
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
        新增
      </el-button>
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
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { useScroll } from '@vueuse/core'
import { element, shiki, useLister } from 'chant'
import { type Model } from '../share'
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
// 初始化
async function onRoot() {
  element.prompt(
    async (instance, done) => {
      const name = instance.inputValue
      instance.confirmButtonLoading = true
      const { code } = await shiki.post('org/root', { name })
      instance.confirmButtonLoading = false
      if (code === '1') {
        done()
        getList()
      }
    },
    { title: '组织名称', required: true }
  )
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
  lister.remove('org/delete', state, { id: row.id })
}
</script>

<style scoped lang="scss">
.tree-container {
  width: 300px;
}
</style>
