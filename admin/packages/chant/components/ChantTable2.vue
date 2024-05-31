<template>
  <div class="chant-table2" ref="boxRef">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="createColumns(width)"
          :data="list"
          :header-height="38"
          fixed
          :row-height="32"
          :row-key="rowKey"
          :height="height"
          :width="width">
        </el-table-v2>
      </template>
    </el-auto-resizer>
  </div>
</template>

<script setup lang="tsx">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Lang, ListColumn2 as Column, ListState } from '@chant/type'

// type
interface Props {
  columns?: Column[] // 列表字段
  columnWidth?: number // 列宽度
  dbEdit?: boolean // 是否可双击编辑
  dict?: any // 字典
  lang?: Lang // 国际化
  list?: any[] // 列表数据
  rowKey?: string // 行数据的key
}
// props
const props = withDefaults(defineProps<Props>(), {
  columnWidth: 144,
  rowKey: 'id'
})
// model
const vModel = defineModel<ListState>()
// use
const { t } = useI18n({ messages: props?.lang })
// computed
const columns = computed(() => {
  return (vModel.value?.columns || props.columns || []) as Column[]
})
const availableColumns = computed(() => {
  return columns.value?.filter((item) => {
    const hideInList = item.hideInPages?.includes('list')
    if (item.onlySearch || item.hide || hideInList) {
      return false
    }
    return true
  })
})
const columnsWidthTotal = computed(() => {
  return availableColumns.value.reduce((acc, cur) => {
    return acc + (cur.fixedWidth || 0)
  }, 0)
})
const notWidthCount = computed(() => {
  return availableColumns.value.filter((item) => !item.fixedWidth).length
})
const list = computed(() => {
  return vModel.value?.list || props.list || []
})
// onMounted
onMounted(() => {
  // 初始化固定宽度
  availableColumns.value.forEach((item) => {
    item.fixedWidth = item.width
  })
})
// 生成columns
function createColumns(width: number) {
  // 容器宽度小于100说明还没渲染完
  if (width < 50) {
    return []
  }
  return availableColumns.value.map((column) => {
    column.key = column.prop
    column.dataKey = column.prop
    // align
    column.align = 'center'
    // title
    const label = column.label || column.prop || ''
    column.title = props.lang ? t(label) : label
    // 计算宽度
    calcWidth(width, column)
    return column
  }) as any[]
}
// 计算宽度
function calcWidth(width: number, column: Column) {
  // 如果定义了宽度则不处理
  if (column.fixedWidth) {
    column.width = column.fixedWidth
    return
  }
  // 剩余可用宽度
  width = width - columnsWidthTotal.value - 10
  const columnWidth = width / notWidthCount.value
  if (columnWidth > props.columnWidth) {
    column.width = columnWidth
  } else {
    column.width = props.columnWidth
  }
}
</script>

<style lang="scss">
.chant-table2 {
  border: 1px solid var(--gray-color);
  flex: 1;
  .el-table-v2 {
    position: relative;
    // header
    .el-table-v2__header-row {
      background-color: var(--gray-color);
      .el-table-v2__header-cell {
        background-color: var(--gray-color);
      }
      .el-table-v2__header-cell + .el-table-v2__header-cell {
        border-left: var(--el-table-border);
      }
    }
    // body
    .el-table-v2__body {
      .el-table-v2__row-cell + .el-table-v2__row-cell {
        border-left: var(--el-table-border);
      }
    }
    // empty
    .el-table-v2__empty {
      position: absolute;
      left: 50%;
      top: 50% !important;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
