<template>
  <div class="chant-table2" ref="boxRef">
    <vxe-table
      v-loading="vModel!.loading"
      align="center"
      auto-resize
      border
      :checkbox-config="{ reserve: props.reserveSelection }"
      :column-config="{ resizable: true }"
      :data="list"
      :empty-text="gt('tips.empty')"
      :height="state.height"
      ref="tableRef"
      :scroll-y="{ enabled: props.scrollY }"
      size="mini"
      @cell-click="onCell"
      @cell-dblclick="onCellDB"
      @checkbox-change="onSelectChange">
      <vxe-column v-if="props.showSelection" type="checkbox" width="35">
      </vxe-column>
      <vxe-column
        v-for="item in availableColumns"
        :key="item.prop"
        :field="item.prop"
        :min-width="item.width || columnWidth"
        show-header-overflow
        :sortable="item.sortable"
        :title="translate(item)">
        <template #default="{ row }">
          <div class="content-box">
            <!-- prop slot -->
            <slot
              v-if="item.slot?.includes('list')"
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
              v-else-if="showTag(item)"
              :effect="item.tagType ? 'dark' : 'plain'"
              :type="item.tagType?.[row[item.prop]]">
              {{ dictFmt(item.prop, row[item.prop]) }}
            </el-tag>
            <!-- text -->
            <chant-tooltip
              v-else
              :class="{
                'copy-text': item.copy && row[item.prop],
                'link-text': item.link
              }"
              :text="valueFmt(item, row[item.prop])"
              @click="item.link && onLink(row)">
            </chant-tooltip>
            <!-- copy -->
            <el-icon
              v-if="item.copy && row[item.prop]"
              class="table-icon-copy"
              @click.stop="onCopy(row[item.prop])">
              <DocumentCopy />
            </el-icon>
          </div>
        </template>
      </vxe-column>
      <!-- slot -->
      <slot></slot>
    </vxe-table>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import Sortable from 'sortablejs'
import {
  computed,
  onActivated,
  onMounted,
  onScopeDispose,
  reactive,
  ref
} from 'vue'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import { VxeTable, VxeTableInstance } from 'vxe-table'
import { DocumentCopy } from '@element-plus/icons-vue'
import { useThrottleFn } from '@vueuse/core'
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
  rowChecked?: boolean // 单元格点击是否可选中
  scrollY?: boolean // 是否虚拟滚动
  showSelection?: boolean // 显示勾选框
  sort?: boolean // 行是否可以拖动
}
// props
const props = withDefaults(defineProps<Props>(), {
  columnWidth: 144,
  dbEdit: true,
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
const resizeThrottle = useThrottleFn(containerAuto, 500)
// ref
const boxRef = ref<HTMLElement>()
const tableRef = ref<VxeTableInstance>()
// state
const state = reactive({
  height: 'auto' as 'auto' | number | undefined
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
const list = computed(() => {
  return vModel.value?.list || props.list || []
})
// onMounted
onMounted(() => {
  // 高度不限制
  if (props.heightWild) {
    state.height = undefined
  }
  // 虚拟滚动
  if (props.scrollY) {
    // 容器自适应
    containerAuto()
    // resize
    window.addEventListener('resize', resizeThrottle)
  }
  // 实例更新
  emits('instance', tableRef.value)
  // 初始化拖拽
  initSortable()
})
// onActivated
onActivated(() => {
  // 容器自适应
  containerAuto()
  // 初始化拖拽
  initSortable()
})
// onScopeDispose
onScopeDispose(() => {
  if (props.scrollY) {
    window.removeEventListener('resize', resizeThrottle)
  }
})
// 容器自适应
function containerAuto() {
  // 虚拟滚动高度固定
  if (props.scrollY) {
    const { offsetHeight } = boxRef.value || {}
    state.height = offsetHeight || 0
  }
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
// 链接
function onLink(row: any) {
  lister.detail(vModel.value!, row)
}
// 单元格点击
function onCell(row: any) {
  if (props.rowChecked) {
    // tableRef.value?.toggleRowSelection(row, undefined)
  }
  emits('row-click', row)
}
// 单元格双击
function onCellDB({ row }: any) {
  if (vModel.value && props.dbEdit) {
    lister.edit(vModel.value, { id: row.id })
  }
}
// 选择项发生变化时
function onSelectChange() {}
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
.chant-table2 {
  flex: 1;
  overflow: hidden;
  .content-box {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .copy-text {
      padding: 0 12px 0 5px;
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
