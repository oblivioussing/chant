<template>
  <div v-loading="state.listLoading" class="column-box">
    <div class="tree-box flex-1">
      <div>源路由</div>
      <div class="tree-container">
        <el-tree
          check-on-click-node
          :data="state.sourceList"
          default-expand-all
          :expand-on-click-node="false"
          :indent="10"
          node-key="id"
          :props="{ label: 'name' }"
          show-checkbox
          @check="onSource">
        </el-tree>
      </div>
    </div>
    <div class="tree-box flex-1">
      <div>目标路由</div>
      <div class="tree-container">
        <el-tree
          check-on-click-node
          :data="state.targetList"
          default-expand-all
          :expand-on-click-node="false"
          :indent="10"
          node-key="id"
          :props="{ label: 'name' }"
          ref="targetRef"
          show-checkbox
          @check="onTarget">
        </el-tree>
      </div>
    </div>
  </div>
  <chant-form-footer
    v-model="state"
    @close="former.close(state, emits)"
    @save="onSave">
  </chant-form-footer>
</template>

<script setup lang="ts">
import { ElMessage, type TreeInstance } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { shiki, useFormer } from 'chant'
import type { FormEmits } from 'chant/type'
import { type Model } from '../share'

// emits
const emits = defineEmits<FormEmits>()
// use
const former = useFormer()
// ref
const targetRef = ref<TreeInstance>()
// state
let state = reactive({
  ...former.state,
  form: {
    id: '',
    ids: [] as string[]
  },
  sourceList: [] as any[],
  targetList: [] as any[],
  listLoading: false
})
// onMounted
onMounted(() => {
  // 获取源列表
  getSourceList()
  // 获取目标列表
  getTargetList()
})
// 获取源列表
async function getSourceList() {
  state.listLoading = true
  const { data } = await shiki.get('router/source')
  state.listLoading = false
  state.sourceList = data
}
// 获取目标列表
async function getTargetList() {
  state.listLoading = true
  const { data } = await shiki.get('router/target')
  state.listLoading = false
  state.targetList = data
}
// 源
function onSource(_: Model, row: { checkedNodes: Model[] }) {
  state.form.ids = row.checkedNodes
    .filter((item) => item.level === 2)
    .map((item) => item.id)
}
// 目标
function onTarget(row: Model) {
  targetRef.value?.setCheckedKeys([])
  targetRef.value?.setCheckedKeys([row.id])
  state.form.id = row.id
}
// 保存
function onSave() {
  const { id, ids } = state.form
  if (!id) {
    ElMessage.warning('请选择要转移的目标路由')
    return
  }
  if (!ids?.length) {
    ElMessage.warning('请选择要转移的路由')
    return
  }
  former.save('router/transfer', state)
}
</script>

<style scoped lang="scss"></style>
