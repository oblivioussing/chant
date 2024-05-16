<template>
  <el-table
    v-loading="vModel?.loading || false"
    :border="true"
    class="chant-table"
    :data="list"
    :height="state.height || undefined"
    ref="tableRef"
    :row-key="(row) => row[props.rowKey]"
    @row-click="onRowClick"
    @row-dblclick="onRowDbClick"
    @selection-change="onSelectChange">
    <!-- 复选框 -->
    <el-table-column
      v-if="props.showSelection"
      align="center"
      fixed="left"
      :reserve-selection="props.reserveSelection"
      :selectable="selectable"
      type="selection"
      width="35" />
    <el-table-column
      v-for="item in availableColumns"
      :key="item.prop"
      align="center"
      :fixed="item.fixed"
      :label="translate(item)"
      :min-width="item.width || columnWidth || 144"
      :prop="item.prop"
      show-overflow-tooltip
      :sortable="item.sortable">
      <template #header>
        <chant-tooltip
          style="color: var(--el-table-header-text-color)"
          :text="translate(item)">
        </chant-tooltip>
      </template>
      <template #default="{ row, $index }">
        <div class="content-box">
          <!-- prop slot -->
          <slot
            v-if="item.slotList"
            :index="$index"
            :item="item"
            :name="item.prop"
            :row="row"
            :value="row[item.prop]">
          </slot>
          <!-- 可编辑 -->
          <template v-else-if="item.editable">
            <!-- input -->
            <el-input
              v-if="!item.type"
              v-model="row[item.prop]"
              :placeholder="translate(item)">
            </el-input>
            <!-- select -->
            <chant-select
              v-else-if="item.type === 'select'"
              v-model="row[item.prop]"
              clearable
              :data="props.dict?.[item.prop]"
              :lang="lang"
              :placeholder="translate(item)">
            </chant-select>
            <!-- input-number -->
            <el-input-number
              v-else-if="item.type === 'input-number'"
              v-model="row[item.prop]"
              controls-position="right"
              :placeholder="translate(item)">
            </el-input-number>
          </template>
          <!-- tag -->
          <el-tag
            v-else-if="item.type === 'select'"
            :effect="item.tagType ? 'dark' : 'plain'"
            :type="item.tagType?.[row[item.prop]]">
            {{ dictFmt(item.prop, row[item.prop]) }}
          </el-tag>
          <!-- text -->
          <el-text
            v-else
            :class="{
              'copy-text': item.copy && row[item.prop],
              'link-text': item.link
            }"
            truncated
            @click.stop="onLink(row)">
            {{ valueFmt(item, row[item.prop]) }}
          </el-text>
          <!-- copy -->
          <el-icon
            v-if="item.copy && row[item.prop]"
            class="table-icon-copy"
            @click.stop="onCopy(row[item.prop])">
            <DocumentCopy />
          </el-icon>
        </div>
      </template>
    </el-table-column>
    <!-- slot -->
    <slot></slot>
  </el-table>
</template>

<script setup lang="ts">
import { ElMessage, type TableInstance } from 'element-plus'
import dayjs from 'dayjs'
// @ts-ignore
import Sortable from 'sortablejs'
import {
  computed,
  onActivated,
  onMounted,
  reactive,
  ref,
  watch,
  type InputHTMLAttributes
} from 'vue'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import { DocumentCopy } from '@element-plus/icons-vue'
import { useLister } from '@chant'
import type { Lang, ListColumn as Column, ListState } from '@chant/type'

// defineExpose
defineExpose({
  scrollToBottom // 滚动到底部
})
// type
interface Props {
  columns?: Column[] // 列表字段
  columnWidth?: number // 列宽度
  dbEdit?: boolean // 是否可双击编辑
  dict?: any // 字典
  heightWild?: boolean // 高度不限制
  lang?: Lang // 国际化
  list?: any[] // 列表数据
  reserveSelection?: boolean // 数据刷新后是否保留选项
  rowChecked?: boolean // 行点击是否可选中
  rowKey?: string // 行数据的key
  showSelection?: boolean // 显示勾选框
  sort?: boolean // 行是否可以拖动
}
// props
const props = withDefaults(defineProps<Props>(), {
  dbEdit: true,
  rowKey: 'id',
  showSelection: true
})
// emits
const emits = defineEmits(['instance', 'row-click'])
// model
const vModel = defineModel<ListState>()
// use
const { toClipboard } = useClipboard()
const { t } = useI18n({ messages: props?.lang })
const { t: gt } = useI18n({ useScope: 'global' })
const lister = useLister()
// ref
const tableRef = ref<TableInstance>()
// state
let state = reactive({
  height: 0
})
// resize
window.addEventListener('resize', () => {
  // 列表容器自适应
  tableAdapter()
})
// computed
const availableColumns = computed(() => {
  return columns.value?.filter((item) => {
    const hideInList = item.hideInPages?.includes('list')
    if (item.onlySearch || item.hide || hideInList) {
      return false
    }
    return true
  })
})
const columns = computed(() => {
  return vModel.value?.columns || props.columns
})
const list = computed(() => {
  return vModel.value?.list || props.list
})
// watch
watch(
  () => vModel.value?.allFlag,
  () => {
    // 全选按钮禁用状态
    allCheckedStatus()
  }
)
// 初始化
onMounted(() => {
  // 实例更新
  emits('instance', tableRef.value)
  // 列表容器自适应
  tableAdapter()
  // 初始化拖拽
  initSortable()
})
// 组件激活时
onActivated(() => {
  // 列表容器自适应
  tableAdapter()
  // 初始化拖拽
  initSortable()
})
// 全选按钮禁用状态
function allCheckedStatus() {
  const tablEl = tableRef.value?.$el as HTMLElement
  const labelEl = tablEl.querySelector('.el-table__header-wrapper .el-checkbox')
  const spanEl = labelEl?.querySelector('.el-checkbox__input')
  const inputEl = spanEl?.querySelector(
    '.el-checkbox__original'
  ) as InputHTMLAttributes
  if (vModel.value?.allFlag === 1) {
    labelEl?.classList.add('is-disabled')
    spanEl?.classList.add('is-disabled')
  } else {
    labelEl?.classList.remove('is-disabled')
    spanEl?.classList.remove('is-disabled')
  }
  inputEl.disabled = !!vModel.value?.allFlag
}
// 初始化拖拽
function initSortable() {
  if (!props.sort || !list.value?.length) {
    return
  }
  const el = tableRef.value?.$el.querySelector('.el-table__body > tbody')
  Sortable.create(el, {
    onEnd: (event: any) => {
      const { oldIndex, newIndex } = event
      const oldRow = list.value?.[oldIndex]
      const newRow = list.value?.[newIndex]
      if (list.value) {
        list.value[oldIndex] = newRow
        list.value[newIndex] = oldRow
      }
    }
  })
}
// 滚动到底部
function scrollToBottom() {
  const el = tableRef.value?.$el as HTMLElement
  setTimeout(() => {
    const bodyEl = el.querySelector('.el-table__body')
    tableRef.value?.setScrollTop(bodyEl?.clientHeight)
  }, 0)
}
// 列表容器自适应
function tableAdapter() {
  if (props.heightWild) {
    return
  }
  setTimeout(() => {
    const el = tableRef.value?.$el as HTMLElement
    state.height = el?.offsetHeight
  }, 300)
}
// value格式化
function valueFmt(column: Column, value: any) {
  if (!value && value !== 0) {
    return '-'
  }
  // date
  if (column.datepickerType) {
    const map = {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      month: 'YYYY-MM'
    } as any
    const template = map[column.datepickerType]
    return dayjs(value).format(template)
  }
  // format
  // if(column.format === 'xxx'){}
  // append
  const append = column.append ? gt(column.append) : ''
  return value + append
}
// 字典格式化
function dictFmt(prop: string, value: any) {
  const dict = props.dict?.[prop]
  let val = ''
  if (dict instanceof Map) {
    val = dict.get(value)
  } else {
    val = dict?.[value]
  }
  if (val?.indexOf('dict.') >= 0) {
    return t(val)
  } else {
    return val || '-'
  }
}
// CheckBox是否可勾选
function selectable() {
  return vModel.value?.allFlag === 0
}
// 链接
function onLink(row: any) {
  lister.detail(vModel.value!, row)
}
// 单元格点击
function onRowClick(row: any) {
  if (props.rowChecked) {
    // @ts-expect-error
    tableRef.value?.toggleRowSelection(row, undefined)
  }
  emits('row-click', row)
}
// 单元格双击
function onRowDbClick(row: any) {
  if (vModel.value && props.dbEdit) {
    lister.edit(vModel.value, row)
  }
}
// 选择项发生变化时
function onSelectChange(selection: any[]) {
  if (vModel.value) {
    vModel.value.selections = selection
  }
}
// 复制
async function onCopy(text: string) {
  try {
    await toClipboard(text)
    ElMessage.success(gt('tips.copySuccess'))
  } catch (e) {
    console.error(e)
    ElMessage.error(gt('tips.copyFail'))
  }
}
// 翻译
function translate(column: Column) {
  let label = column.label || column.prop
  if (!props.lang) {
    return label
  }
  return t(label)
}
</script>

<style lang="scss">
.chant-table {
  flex: 1;
  overflow: hidden;
  :deep(.el-button.is-link) {
    font-weight: normal;
  }
  :deep(.el-button + .el-button) {
    margin-left: 3px;
  }
  .cell {
    display: flex !important;
    align-items: center !important;
    justify-content: center;
    padding: 0 5px;
    .table-header {
      border: 1px solid transparent;
      box-sizing: border-box;
      display: inline-block;
      white-space: nowrap;
    }
  }
  .content-box {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .copy-text {
      padding: 0 18px 0 10px;
    }
    .link-text {
      color: var(--main-color);
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .table-icon-copy {
    color: var(--main-color);
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
    position: absolute;
    right: 10px;
  }
}
</style>
