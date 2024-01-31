<template>
  <!-- search -->
  <chant-table-search
    v-model="state"
    :dict="dict"
    @query="getList"
    @reset="getList">
  </chant-table-search>
  <!-- table -->
  <chant-table v-model="state" :dict="dict"></chant-table>
  <!-- pagination -->
  <chant-pagination
    v-model="state.pages"
    :total="state.total"
    @change="getList">
  </chant-pagination>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useLister } from '@/use'
import { columns, dict } from './share'

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
  lister.getData('salary/list', state)
}
</script>

<style scoped lang="scss"></style>
