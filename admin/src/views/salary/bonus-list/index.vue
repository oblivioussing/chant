<template>
  <!-- search -->
  <chant-table-search v-model="state" @query="getList" @reset="getList">
    <!-- 员工 -->
    <template #userName>
      <user-picker
        v-model:id="state.query.userId"
        title="员工"
        @change="getList">
      </user-picker>
    </template>
  </chant-table-search>
  <!-- table -->
  <chant-table v-model="state"></chant-table>
  <!-- pagination -->
  <chant-pagination
    v-model="state.pages"
    :total="state.total"
    @change="getList">
  </chant-pagination>
  <!-- 详情 -->
  <chant-dialog v-model="state.editVisible" :title="lister.title(state)">
  </chant-dialog>
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
