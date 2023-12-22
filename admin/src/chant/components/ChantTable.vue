<template>
  <el-table
    v-bind="$attrs"
    v-loading="vModel.loading"
    :border="true"
    class="chant-table"
    :data="vModel.list"
    :height="state.height || undefined"
    ref="tableRef"
    :row-key="props.rowKey"
    @row-dblclick="onRowDbClick"
    @row-click="onRowClick"
    @select="onSelect"
    @select-all="onSelectAll"
    @selection-change="onSelectionChange">
    <!-- 复选框 -->
    <el-table-column
      v-if="props.showSelection"
      align="center"
      type="selection"
      :selectable="selectable"
      fixed="left"
      width="35" />
    <el-table-column
      v-for="item in columnsList"
      v-bind="item"
      :align="'center'"
      :fixed="item.fixed"
      :key="item.prop"
      :min-width="item.width || columnWidth || 144"
      show-overflow-tooltip
      sortable>
      <template #header>
        <span>{{ translate(item) }}</span>
      </template>
      <template #="{ row, $index }">
        <div class="flex-center">
          <!-- slot -->
          <slot
            v-if="item.slot"
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
            <el-select
              v-else-if="item.type === FormTypeEnum.Select"
              v-model="row[item.prop]"
              :placeholder="translate(item)">
              <el-option
                v-for="(val, key) in vModel.dict?.[item.prop]"
                :key="key"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
            <!-- input-number -->
            <el-input-number
              v-else-if="item.type === FormTypeEnum.InputNumber"
              v-model="row[item.prop]"
              controls-position="right"
              :placeholder="translate(item)">
            </el-input-number>
          </template>
          <!-- dict -->
          <div v-else-if="item.type === FormTypeEnum.Select">
            {{ dictFmt(item.prop, row[item.prop]) || '-' }}
          </div>
          <!-- date -->
          <div v-else-if="isDateFmt(item)">
            {{ format.date(row[item.prop]) || '-' }}
          </div>
          <!-- datetime -->
          <div v-else-if="isDatetimeFmt(item)">
            {{ format.datetime(row[item.prop]) || '-' }}
          </div>
          <!-- 金额 -->
          <div v-else-if="item.format === FormatEnum.Money">
            {{ format.money(row[item.prop]) || '-' }}
          </div>
          <!-- value -->
          <div v-else class="ellipsis-1">
            {{ row[item.prop] || '-' }}
            <template v-if="item.appendLabel">
              {{ tg(item.appendLabel) }}
            </template>
          </div>
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
  </el-table>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  computed,
  nextTick,
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
import { useVModel } from '@vueuse/core'
// @ts-ignore
import Sortable from 'sortablejs'
import {
  FormatEnum,
  FormTypeEnum,
  type ListColumn as Column,
  type ListState
} from '@/chant'
import { vuei18n } from '@/plugs'
import { useLister } from '@/use'
import { base, format } from '@/utils'

// defineExpose
defineExpose({
  scrollToBottom, // 滚动到底部
  toggleRowSelection // 切换某一行的选中状态
})

interface Props {
  columnWidth?: number // 列宽度
  dbEdit?: boolean // 是否双击编辑
  heightWild?: boolean // 高度不限制
  modelValue: ListState // modelValue
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
const emits = defineEmits(['update:modelValue', 'row-click'])
// use
const { toClipboard } = useClipboard()
const { t: tg } = useI18n({ useScope: 'global' })
const lister = useLister()
const vModel = useVModel(props, 'modelValue', emits)
// ref
const tableRef = ref()
// state
const state = reactive({
  height: 0
})
// resize
window.addEventListener('resize', () => {
  // 列表容器自适应
  tableAdapter()
})
// computed
const columnsList = computed(() => {
  return vModel.value.columns?.filter((item) => {
    if (item.onlySearch) {
      return false
    }
    if (item.hide) {
      return false
    }
    return true
  })
})
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = vModel.value.lang
  return lang ? lang[locale] : {}
})
// watch
watch(
  () => vModel.value.allFlag,
  () => {
    const tablEl = tableRef.value?.$el as HTMLElement
    const labelEl = tablEl.querySelector(
      '.el-table__header-wrapper .el-checkbox'
    )
    const spanEl = labelEl?.querySelector('.el-checkbox__input')
    const inputEl = spanEl?.querySelector(
      '.el-checkbox__original'
    ) as InputHTMLAttributes
    if (vModel.value.allFlag === 1) {
      labelEl?.classList.add('is-disabled')
      spanEl?.classList.add('is-disabled')
    } else {
      labelEl?.classList.remove('is-disabled')
      spanEl?.classList.remove('is-disabled')
    }
    inputEl.disabled = !!vModel.value.allFlag
  }
)
// 初始化
onMounted(() => {
  // 列表容器自适应
  tableAdapter()
  // 拖拽
  sortCreate()
})
// 组件激活时
onActivated(() => {
  // 列表容器自适应
  tableAdapter()
  // 拖拽
  sortCreate()
})
// 拖拽
function sortCreate() {
  const list = vModel.value.list
  if (!props.sort || !list?.length) {
    return
  }
  const el = tableRef.value?.$el.querySelector('.el-table__body > tbody')
  Sortable.create(el, {
    onEnd: (event: any) => {
      const data = base.clone(list)
      const item = data?.splice(event.oldIndex, 1)[0]
      data?.splice(event.newIndex, 0, item)
      data?.forEach((item, index) => {
        item.serialNo = index + 1
      })
      vModel.value.list = data as any[]
      emits('update:modelValue', vModel.value)
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
  nextTick(() => {
    const el = tableRef.value?.$el as HTMLElement
    state.height = el?.offsetHeight
  })
}
// 是否date格式化
function isDateFmt(column: Column) {
  if (column.type) {
    return [FormTypeEnum.Date, FormTypeEnum.DateRange].includes(column.type)
  }
  return false
}
// 是否datetime格式化
function isDatetimeFmt(column: Column) {
  if (column.type) {
    return [FormTypeEnum.Datetime, FormTypeEnum.DatetimeRange].includes(
      column.type
    )
  }
  return false
}
// 字典格式化
function dictFmt(prop: string, value: any) {
  return vModel.value.dict?.[prop]?.[value]
}
// 切换某一行的选中状态
function toggleRowSelection(row: any, selected: boolean) {
  tableRef.value?.toggleRowSelection(row, selected)
}
// CheckBox是否可勾选
function selectable() {
  return !props?.modelValue?.allFlag
}
// 勾选处理
function selectHandle(type: 'checked' | 'remove', index: number, row: any) {
  const value = vModel.value!
  const selectionList = value.selectionList
  if (type === 'checked') {
    selectionList.push(row)
  } else {
    selectionList.splice(index, 1)
  }
  value.selectionRow = selectionList[0] || {}
}
// 勾选数据行
function onSelect(selection: any[], row: any) {
  const selectionList = vModel.value!.selectionList
  const id = props.rowKey
  const index = selectionList.findIndex((item) => item[id] === row[id])
  const type =
    selection.findIndex((item) => item[id] === row[id]) >= 0
      ? 'checked'
      : 'remove'
  selectHandle(type, index, row)
}
// 手动勾选全选
function onSelectAll(selection: any[]) {
  const value = vModel.value!
  const selectionList = value.selectionList
  let list: any[] | undefined
  if (selection.length) {
    list = selectionList?.concat(selection)
  } else {
    list = selectionList?.filter(
      (item) =>
        !value.list.find((child) => child[props.rowKey] === item[props.rowKey])
    )
  }
  value.selectionList = base.distinct(list)
  value.selectionIdList = value.selectionList.map((item) => item[props.rowKey])
}
// 选择项发生变化
function onSelectionChange(selection: any[]) {
  const value = vModel.value!
  nextTick(() => {
    value.selectionList = selection
    value.selectionIdList = value.selectionList.map(
      (item) => item[props.rowKey]
    )
    value.selectionId = selection[0]?.[props.rowKey]
    value.selectionRow = selection[0] || {}
  })
}
// 单元格点击
function onRowClick(row: any) {
  emits('row-click', row)
}
// 单元格双击
function onRowDbClick(row: any) {
  if (props.dbEdit) {
    lister.jump('/edit', { id: row.id })
  }
}
// 复制
async function onCopy(text: string) {
  try {
    await toClipboard(text)
    ElMessage.success(tg('tips.copySuccess'))
  } catch (e) {
    console.error(e)
    ElMessage.error(tg('tips.copyFail'))
  }
}
// 翻译
function translate(column: Column) {
  let label = column.label || column.prop
  var pattern = new RegExp('[\u4E00-\u9FA5]+')
  if (pattern.test(label)) {
    return label
  }
  if (label.indexOf('.') >= 0) {
    return tg(label)
  }
  return messages.value[label]
}
</script>

<style scoped lang="scss">
.chant-table {
  flex: 1;
  margin-top: 5px;
  overflow: hidden;
  ::v-deep(.link) {
    color: #409eff;
    cursor: pointer;
    overflow: hidden;
    text-decoration: underline;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ::v-deep(.el-button) {
    height: 23px;
    width: 23px;
  }
  ::v-deep(.el-button + .el-button) {
    margin-left: 6px;
  }
  .table-icon-copy {
    color: #409eff;
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>