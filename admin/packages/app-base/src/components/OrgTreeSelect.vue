<template>
  <el-tree-select
    v-model="vModel"
    clearable
    :data="state.data"
    :props="{ label: 'name', value: 'id' }">
  </el-tree-select>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { shiki } from 'chant'

// model
const vModel = defineModel()
// state
const state = reactive({
  data: []
})
// onMounted
onMounted(() => {
  // 获取组织树
  getOrg()
})
// 获取组织树
async function getOrg() {
  const { data } = await shiki.get('org/tree')
  state.data = data
}
</script>

<style scoped lang="scss"></style>
