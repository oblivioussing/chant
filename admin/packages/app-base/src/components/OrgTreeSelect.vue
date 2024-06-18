<template>
  <el-tree-select
    v-model="vModel"
    check-strictly
    clearable
    :data="state.data"
    default-expand-all
    filterable
    :indent="10"
    node-key="id"
    placeholder="请选择部门"
    :props="{ label: 'name' }"
    @node-click="onNode">
  </el-tree-select>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { shiki } from 'chant'

// emits
const emits = defineEmits(['change'])
// model
const vModel = defineModel()
// state
const state = reactive({
  data: [] as any[]
})
// onMounted
onMounted(() => {
  // 获取树列表
  getList()
})
// 获取树列表
async function getList() {
  const { data } = await shiki.get('org/tree')
  state.data = data
}
// 节点点击
function onNode(row: any) {
  vModel.value = row.id
  emits('change', row)
}
</script>

<style scoped lang="scss"></style>
