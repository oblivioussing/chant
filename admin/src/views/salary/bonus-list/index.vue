<template>
  <!-- search -->
  <chant-table-search v-model="state" @query="getList"></chant-table-search>
  <!-- table -->
  <chant-table v-model="state"></chant-table>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useLister } from '@/use'
import { columns } from './share'

// use
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns: columns()
})
// created
lister.created(() => {
  // 获取列表
  getList()
})
// 获取列表
function getList() {
  lister.getData('bonus/list', state, { limit: false })
}
</script>

<style scoped lang="scss"></style>
