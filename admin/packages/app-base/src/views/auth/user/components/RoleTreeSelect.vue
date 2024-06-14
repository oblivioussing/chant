<template>
  <el-tree-select
    v-model="vModel"
    check-on-click-node
    check-strictly
    clearable
    :data="state.data"
    default-expand-all
    filterable
    multiple
    node-key="id"
    placeholder="请选择角色"
    :props="{ label: 'name' }"
    show-checkbox>
  </el-tree-select>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { shiki } from 'chant'

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
  const { data } = await shiki.get('role/tree')
  state.data = data
}
</script>

<style scoped lang="scss"></style>
