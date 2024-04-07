<template>
  <!-- table -->
  <chant-table
    :columns="createColumns()"
    :dict="props.dict"
    :list="props.list"
    :lang="props.lang"
    :show-selection="false">
    <!-- 操作 -->
    <chant-column-operate :width="60">
      <template #="{ row }">
        <!-- 删除 -->
        <el-button link type="danger" @click="onDelete(row)">
          {{ gt('button.delete') }}
        </el-button>
      </template>
    </chant-column-operate>
  </chant-table>
  <!-- pagination -->
  <chant-pagination layout="total" :total="props.list?.length || 0">
  </chant-pagination>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { type ListColumn as Column } from '@/chant'

// props
const props = defineProps<{
  columns: Column[]
  columnsSet: Column['prop'][]
  dict?: any
  list?: any[]
  lang?: any
}>()
// emits
const emits = defineEmits(['delete'])
// use
const { t: gt } = useI18n({ useScope: 'global' })
// 生成columns
function createColumns() {
  return props.columnsSet.map((item) => {
    const row = props.columns.find((column) => column.prop === item)
    return row as Column
  })
}
// 删除
function onDelete(row: any) {
  emits('delete', row)
}
</script>

<style scoped lang="scss"></style>
