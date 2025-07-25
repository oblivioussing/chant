<template>
  <el-table
    v-loading="vModel?.loading || false"
    :border="true"
    class="chant-table"
    :data="list"
    :height="state.height || undefined"
    ref="tableRef"
    :row-key="(row: any) => row[props.rowKey]"
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
    <!-- table-column -->
    <el-table-column
      v-for="item in availableColumns"
      :key="item.prop"
      align="center"
      :fixed="item.fixed"
      :label="translate(item)"
      :width="item.width ? item.width : undefined"
      :min-width="item.width ? undefined : columnWidth"
      :prop="item.prop"
      show-overflow-tooltip
      sortable>
      <template #header>
        <chant-tooltip
          style="color: var(--el-table-header-text-color)"
          :text="translate(item)">
        </chant-tooltip>
      </template>
      <template #default="{ row, $index }">
        <div v-if="$index >= 0" class="content-box">
          <!-- prop slot -->
          <slot
            v-if="item.slot?.includes('list')"
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
              v-if="!item.type && !item.dynamicPicker && !item.datePicker"
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
            v-else-if="showTag(item)"
            :class="
              item.tagColor?.[row[item.prop]] ||
              tagColor(row[item.prop], item.prop)
            "
            effect="dark">
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
            @click="item.link && onLink(row)">
            {{ valueFmt(item, row[item.propInList || item.prop]) }}
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
  columnWidth: 144,
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
// var
const tagColorList = [
  'blue',
  'green',
  'orange',
  'red',
  'purple',
  'cyan',
  'teal',
  'yellow',
  'pink',
  'indigo',
  'gray'
]
const tagValMap = {} as Record<string, Set<string>>
// ref
const tableRef = ref<TableInstance>()
// state
let state = reactive({
  height: 0
})
// computed
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
const columns = computed(() => {
  return vModel.value?.columns || props.columns
})
const list = computed(() => {
  return vModel.value?.list || props.list
})
// defineExpose
defineExpose({
  scrollToBottom // 滚动到底部
})
// watch
watch(
  () => vModel.value?.all,
  () => {
    // 全选按钮禁用状态
    allCheckedStatus()
  }
)
// resize
window.addEventListener('resize', () => {
  // 列表容器自适应
  tableAdapter()
})
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
  if (vModel.value?.all === 1) {
    labelEl?.classList.add('is-disabled')
    spanEl?.classList.add('is-disabled')
  } else {
    labelEl?.classList.remove('is-disabled')
    spanEl?.classList.remove('is-disabled')
  }
  inputEl.disabled = !!vModel.value?.all
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
// 显示tag
function showTag(column: Column) {
  return ['radio', 'select'].includes(column.type as any)
}
// value格式化
function valueFmt(column: Column, value: any) {
  if (!value && value !== 0) {
    return '-'
  }
  // date
  if (column.datePicker) {
    const map = {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      month: 'YYYY-MM'
    } as any
    const template = map[column.datePicker]
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
// tag颜色
function tagColor(val: any, prop: string) {
  let set = tagValMap[prop]
  if (!set) {
    set = new Set()
  }
  set.add(val)
  tagValMap[prop] = set
  const arr = Array.from(set)
  const index = arr.indexOf(val)
  return tagColorList[index]
}
// CheckBox是否可勾选
function selectable() {
  return vModel.value?.all === 0
}
// 链接
function onLink(row: any) {
  lister.detail(vModel.value!, row)
}
// 单元格点击
function onRowClick(row: any) {
  if (props.rowChecked) {
    tableRef.value?.toggleRowSelection(row, undefined)
  }
  emits('row-click', row)
}
// 单元格双击
function onRowDbClick(row: any) {
  if (vModel.value && props.dbEdit) {
    lister.edit(vModel.value, { id: row.id })
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
  const label = column.label || column.prop
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
  .el-table__inner-wrapper {
    height: 100% !important;
  }
  .el-table__header-wrapper {
    height: 38px;
    line-height: 38px;
    .el-table__cell {
      background-color: var(--gray-color) !important;
    }
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
    }
  }
  .cell {
    padding: 0 5px;
  }
  .content-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
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
  .el-tag.el-tag--dark {
    --blue: #409eff;
    --green: #67c23a;
    --orange: #e6a23c;
    --red: #f56c6c;
    --purple: #9966cc;
    --cyan: #17c0eb;
    --teal: #20c997;
    --yellow: #f7ba2a;
    --pink: #eb5286;
    --indigo: #5c6bc0;
    --gray: #909399;
    &.blue {
      --el-tag-bg-color: var(--blue);
      --el-tag-border-color: var(--blue);
      --el-tag-hover-color: var(--blue);
    }
    &.gray {
      --el-tag-bg-color: var(--gray);
      --el-tag-border-color: var(--gray);
      --el-tag-hover-color: var(--gray);
    }
    &.orange {
      --el-tag-bg-color: var(--orange);
      --el-tag-border-color: var(--orange);
      --el-tag-hover-color: var(--orange);
    }
    &.red {
      --el-tag-bg-color: var(--red);
      --el-tag-border-color: var(--red);
      --el-tag-hover-color: var(--red);
    }
    &.purple {
      --el-tag-bg-color: var(--purple);
      --el-tag-border-color: var(--purple);
      --el-tag-hover-color: var(--purple);
    }
    &.cyan {
      --el-tag-bg-color: var(--cyan);
      --el-tag-border-color: var(--cyan);
      --el-tag-hover-color: var(--cyan);
    }
    &.teal {
      --el-tag-bg-color: var(--teal);
      --el-tag-border-color: var(--teal);
      --el-tag-hover-color: var(--teal);
    }
    &.yellow {
      --el-tag-bg-color: var(--yellow);
      --el-tag-border-color: var(--yellow);
      --el-tag-hover-color: var(--yellow);
    }
    &.pink {
      --el-tag-bg-color: var(--pink);
      --el-tag-border-color: var(--pink);
      --el-tag-hover-color: var(--pink);
    }
    &.indigo {
      --el-tag-bg-color: var(--indigo);
      --el-tag-border-color: var(--indigo);
      --el-tag-hover-color: var(--indigo);
    }
    &.green {
      --el-tag-bg-color: var(--green);
      --el-tag-border-color: var(--green);
      --el-tag-hover-color: var(--green);
    }
  }
}
</style>
