<template>
  <div v-loading="state.loading" class="chant-table2" ref="boxRef">
    <el-table-v2
      v-if="!state.loading"
      v-loading="vModel!.loading"
      v-bind="$attrs"
      :columns="createColumns"
      :data="list"
      :estimated-row-height="props.estimatedRowHeight"
      fixed
      :header-height="38"
      :row-height="32"
      :height="state.height"
      :width="state.width">
      <!-- row -->
      <template v-if="props.slotRow" #row="data">
        <slot v-bind="data" name="row"></slot>
      </template>
      <!-- cell -->
      <template #cell="data">
        <template v-if="data.column.slot?.includes('list')">
          <slot v-bind="data" :name="data.column.prop"></slot>
        </template>
        <template v-else>
          {{ data.rowData[data.column.prop] }}
        </template>
      </template>
    </el-table-v2>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onActivated,
  onMounted,
  onScopeDispose,
  reactive,
  ref
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useThrottleFn } from '@vueuse/core'
import type { Lang, ListColumn2 as Column, ListState } from '@chant/type'

// type
interface Props {
  columns?: Column[] // 列表字段
  columnWidth?: number // 列宽度
  dbEdit?: boolean // 是否可双击编辑
  dict?: any // 字典
  estimatedRowHeight?: number // 动态高度
  lang?: Lang // 国际化
  list?: any[] // 列表数据
  slotRow?: boolean // slot row
}
// props
const props = withDefaults(defineProps<Props>(), {
  columnWidth: 144
})
// model
const vModel = defineModel<ListState>()
// use
const { t } = useI18n({ messages: props?.lang })
const resizeThrottle = useThrottleFn(containerAuto, 500)
// ref
const boxRef = ref<HTMLElement>()
// state
const state = reactive({
  height: 0,
  width: 0,
  loading: true
})
// computed
const columns = computed(() => {
  return (vModel.value?.columns || props.columns || []) as Column[]
})
const availableColumns = computed(() => {
  return columns.value?.filter((item) => {
    if (!item) {
      return false
    }
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
const createColumns = computed(() => {
  return availableColumns.value.map((column) => {
    column.key = column.prop
    column.dataKey = column.prop
    // align
    column.align = 'center'
    // title
    const label = column.label || column.prop || ''
    column.title = props.lang ? t(label) : label
    // 计算宽度
    calcWidth(column)
    console.log(column)
    return column
  }) as any[]
})
const list = computed(() => {
  return vModel.value?.list || props.list || []
})
// onMounted
onMounted(() => {
  setTimeout(() => {
    // 容器自适应
    containerAuto()
    state.loading = false
  }, 500)
  // resize
  window.addEventListener('resize', resizeThrottle)
  // 初始化固定宽度
  availableColumns.value.forEach((item) => {
    item.fixedWidth = item.width
  })
})
// onActivated
onActivated(() => {
  // 容器自适应
  containerAuto()
})
// onScopeDispose
onScopeDispose(() => {
  window.removeEventListener('resize', resizeThrottle)
})
// 容器自适应
function containerAuto() {
  const { offsetHeight, offsetWidth } = boxRef.value || {}
  state.height = offsetHeight || 0
  // estimatedRowHeight适配,不然header部分也会滚动
  if (props.estimatedRowHeight) {
    state.height = state.height - 2
  }
  // 减2px是为了显示右侧边框
  state.width = (offsetWidth || 0) - 2
}
// 计算宽度
function calcWidth(column: Column) {
  let width = boxRef.value?.offsetWidth || 0
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
      .cell-box {
        display: flex;
        align-items: center;
        min-height: 32px;
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
