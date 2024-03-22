<template>
  <div class="toolbar chant-pagination">
    <el-pagination
      background
      :current-page="vModel?.pageNum"
      :layout="props.layout"
      :pager-count="props.pagerCount"
      :page-size="vModel?.pageSize"
      :page-sizes="[10, 20, 50]"
      small
      :total="props.total"
      @current-change="onCurrent"
      @size-change="onSize">
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { type ModelRef } from 'vue'

type Pages = {
  pageNum: number
  pageSize: number
}
interface Props {
  layout?: string
  total: number
  pagerCount?: number
}
// props
const props = withDefaults(defineProps<Props>(), {
  layout: 'total, sizes, prev, pager, next, jumper',
  pagerCount: 7
})
// emit
const emit = defineEmits(['change'])
// model
const vModel = defineModel() as ModelRef<Pages>
// page改变时
function onCurrent(page: number) {
  vModel.value.pageNum = page
  emit('change')
}
// size改变时
function onSize(size: number) {
  vModel.value.pageSize = size
  emit('change')
}
</script>

<style scoped lang="scss">
.chant-pagination {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  margin-top: 5px;
  // 貌似是element-plus的bug
  :deep(.el-input__validateIcon) {
    display: none;
  }
}
</style>
