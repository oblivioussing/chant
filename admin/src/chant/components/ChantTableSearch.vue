<template>
  <div class="toolbar chant-table-search" ref="searchRef">
    <!-- form -->
    <el-form
      class="form"
      :inline="true"
      :label-width="props.labelWidth"
      :model="vModel?.query"
      ref="formRef"
      @keyup.enter="onSubmit('query')">
      <slot></slot>
      <!-- 查询条件 -->
      <template v-for="item in availableColumns">
        <el-form-item
          v-if="vModel"
          :key="item.prop"
          :label="translate(item) + ':'"
          :prop="item.prop"
          :required="item.searchRequired"
          :rules="[{ required: item.searchRequired, message: '' }]">
          <!-- slot -->
          <slot v-if="item.slotSearch" :name="item.prop" :row="item"></slot>
          <!-- input -->
          <el-input
            v-else-if="!item.type || item.type === 'input'"
            v-model="vModel.query[item.like ? item.prop + 'Like' : item.prop]"
            :clearable="item.clearable !== false"
            :placeholder="translate(item, 'enter')">
            <template v-if="item.prepend" #prepend>
              {{ tg(item.prepend) }}
            </template>
            <template v-else-if="item.append" #append>
              {{ tg(item.append) }}
            </template>
          </el-input>
          <!-- input-number -->
          <el-input-number
            v-else-if="item.type === 'input-number'"
            v-model="vModel.query[item.prop]"
            controls-position="right"
            :placeholder="translate(item, 'enter')">
          </el-input-number>
          <!-- select -->
          <chant-select
            v-else-if="item.type === 'select'"
            v-model="vModel.query[item.prop]"
            :clearable="item.clearable !== false"
            :data="props.dict?.[item.prop]"
            :lang="lang"
            :placeholder="translate(item, 'select')"
            @change="emits('query')">
          </chant-select>
          <!-- date-picker -->
          <template v-else-if="item.type === 'date-picker'">
            <el-date-picker
              v-if="isDateRange(item)"
              v-model="state.range[item.prop]"
              :clearable="item.clearable !== false"
              :placeholder="translate(item, 'select')"
              :start-placeholder="translate(item)"
              :end-placeholder="translate(item)"
              :type="item.searchDatepickerType || item.datepickerType"
              :value-format="item.valueFormat"
              @change="onDateRangeChange(item)">
            </el-date-picker>
            <el-date-picker
              v-else
              v-model="vModel.query[item.prop]"
              :clearable="item.clearable !== false"
              :placeholder="translate(item, 'select')"
              :type="item.searchDatepickerType || item.datepickerType"
              :value-format="item.valueFormat"
              @change="emits('query')">
            </el-date-picker>
          </template>
          <!-- input-number-range -->
          <div
            v-else-if="item.type === 'input-number-range'"
            class="input-range">
            <el-input-number
              v-model="vModel.query[rangeField(item, 'start')]"
              controls-position="right"
              :placeholder="translate(item)">
            </el-input-number>
            <div class="connector">~</div>
            <el-input-number
              v-model="vModel.query[rangeField(item, 'end')]"
              controls-position="right"
              :placeholder="translate(item)">
            </el-input-number>
          </div>
          <!-- custom-picker -->
          <dynamic-picker
            v-if="item.type === 'custom-picker'"
            v-model:id="vModel.query[item.dynamicId || item.prop]"
            :title="translate(item)"
            :type="item.customPicker!"
            @change="emits('query')">
          </dynamic-picker>
        </el-form-item>
      </template>
    </el-form>
    <!-- 展开搜索 -->
    <chant-button
      v-if="state.arrow === 'down'"
      :content="t('spread')"
      :icon="ArrowDown"
      @click="onCollapse('up')">
    </chant-button>
    <!-- 关闭搜索 -->
    <chant-button
      v-if="state.arrow === 'up'"
      :content="t('fold')"
      :icon="ArrowUp"
      @click="onCollapse('down')">
    </chant-button>
    <el-button-group style="margin-left: 10px">
      <!-- 查询 -->
      <chant-button
        :content="t('query')"
        :icon="Search"
        @click="onSubmit('query')">
      </chant-button>
      <!-- 重置 -->
      <chant-button
        :content="t('reset')"
        :icon="Refresh"
        @click="onSubmit('reset')">
      </chant-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { computed, onMounted, onScopeDispose, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown, ArrowUp, Refresh, Search } from '@element-plus/icons-vue'
import { useThrottleFn } from '@vueuse/core'
import {
  base,
  formUtils,
  type Lang,
  type ListColumn as Column,
  type ListState
} from '@/chant'
import chantLang from '@/lang/chant'

// props
const props = defineProps<{
  dict?: any // 字典
  labelWidth?: string // label宽度
  lang?: Lang // 国际化
  queryInit?: Function // 查询条件初始化
  searchOrder?: string[] // 搜索字段顺序
  unfold?: boolean // 自动展开搜索条件
}>()
// emits
const emits = defineEmits(['query', 'reset'])
// model
const vModel = defineModel<ListState>()
// use
const en = { ...props.lang?.en, ...chantLang.en }
const zh = { ...props.lang?.zh, ...chantLang.zh }
const { t } = useI18n({ messages: { en, zh } })
const { t: tg } = useI18n({ useScope: 'global' })
const resizeThrottle = useThrottleFn(containerAuto, 1000)
// ref
const formRef = ref<FormInstance>()
const searchRef = ref()
// state
const state = reactive({
  arrow: props.unfold ? 'up' : 'down',
  range: {} as any
})
// computed
const availableColumns = computed(() => {
  const columns = vModel.value?.columns
  const searchOrder = base.clone(props.searchOrder)?.reverse()
  return columns?.reduce((acc: Column[], cur: Column) => {
    const status = !cur.hide && (cur.search || cur.onlySearch || cur.slotSearch)
    if (!status) {
      return acc
    }
    searchOrder?.forEach((item) => {
      item === cur.prop && acc.unshift(cur)
    })
    const row = acc.find((item) => item.prop === cur.prop)
    !row && acc.push(cur)
    return acc
  }, [])
})
// watch
watch(availableColumns, () => {
  setTimeout(() => {
    // 容器高度自适应
    containerAuto()
  }, 300)
})
// onMounted
onMounted(() => {
  // resize
  window.addEventListener('resize', resizeThrottle)
  // 绑定查询条件的值
  bindQueryValue()
  // 容器高度自适应
  setTimeout(() => {
    containerAuto()
  }, 1500)
})
// onScopeDispose
onScopeDispose(() => {
  window.removeEventListener('resize', resizeThrottle)
})
// 绑定查询条件的值
function bindQueryValue() {
  if (props.queryInit && vModel.value?.query) {
    vModel.value.query = props.queryInit()
  }
  const query = vModel.value?.query
  vModel.value?.columns?.forEach((item) => {
    if (isDateRange(item)) {
      const start = rangeField(item, 'start')
      const end = rangeField(item, 'end')
      state.range[item.prop] = [query?.[start], query?.[end]]
    }
  })
}
// 容器高度自适应
function containerAuto() {
  if (state.arrow === 'up') {
    const el = searchRef.value as HTMLElement
    el.style.height = 'auto'
    const height = el.offsetHeight
    el.style.height = '48px'
    setTimeout(() => {
      el.style.height = height + 'px'
    }, 0)
  }
}
// 是否为date range
function isDateRange(column: Column) {
  const dateType = column.searchDatepickerType || column.datepickerType
  return formUtils.isDateRange(dateType)
}
// range field
function rangeField(column: Column, type: 'start' | 'end') {
  const suffix = type.replace(/^\S/, (s) => s.toUpperCase())
  if (column.dynamicStart || column.dynamicEnd) {
    const key = `dynamic${suffix}` as 'dynamicStart' | 'dynamicEnd'
    return column[key]!
  }
  return `${column.prop}${suffix}`
}
// 展开/关闭
function onCollapse(type: 'down' | 'up') {
  state.arrow = type
  if (type === 'down') {
    searchRef.value.style.height = '48px'
  } else {
    // 容器高度自适应
    containerAuto()
  }
}
// 日期范围选择
function onDateRangeChange(column: Column) {
  let value = state.range[column.prop]
  if (!value) {
    value = ['', '']
  }
  if (vModel.value) {
    vModel.value.query[rangeField(column, 'start')] = value[0]
    vModel.value.query[rangeField(column, 'end')] = value[1]
  }
  emits('query')
}
// 提交
async function onSubmit(type: 'query' | 'reset') {
  try {
    if (type === 'reset' && vModel.value) {
      vModel.value.pages.pageNum = 1
      vModel.value.query = {}
      bindQueryValue()
    }
    const status = await formRef.value?.validate()
    status && emits(type)
  } catch (error) {
    console.error(error)
  }
}
// 翻译
function translate(column: Column, type?: 'enter' | 'select') {
  const label = column.label || column.prop
  const map = {
    enter: tg('tips.enter'),
    select: tg('tips.select')
  }
  const tips = type ? map[type] : ''
  if (props.lang) {
    return tips + t(label)
  } else {
    return tips + label
  }
}
</script>

<style lang="scss">
.chant-table-search {
  --input-width: 165px;
  box-sizing: border-box;
  display: flex;
  height: 48px;
  margin-bottom: 5px;
  overflow: hidden;
  transition: height 0.3s;
  .form {
    flex: 1;
    margin-top: -10px;
    margin-right: 5px;
    .el-form-item {
      margin: 12px 10px 0 0;
    }
    // range
    .input-range {
      display: flex;
      align-items: center;
      .el-input-number {
        width: 154px;
      }
      .connector {
        text-align: center;
        width: 32px;
      }
    }
    // input
    .el-input {
      width: var(--input-width);
      .el-input-group__append,
      .el-input-group__prepend {
        padding: 0 6px;
      }
    }
    // input-number
    .el-input-number {
      width: var(--input-width);
    }
    // select
    .el-select {
      width: var(--input-width);
    }
    // date
    .el-date-editor.el-input {
      width: var(--input-width);
    }
    // date range
    .el-date-editor--daterange {
      box-sizing: border-box;
      width: 210px;
    }
    // datetime range
    .el-date-editor--datetimerange {
      background-color: #ffffff;
      box-sizing: border-box;
      width: 330px;
    }
  }
}
</style>
