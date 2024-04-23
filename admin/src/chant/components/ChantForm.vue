<template>
  <div class="chant-form">
    <el-form
      :label-width="labelWidthCpd"
      :model="vModel?.form"
      :disabled="vModel?.pageType === 'detail'"
      ref="formRef">
      <template v-for="item in availableColumns" :key="item.prop">
        <!-- divider -->
        <el-divider v-if="item.title" content-position="left">
          {{ translate(item) }}
        </el-divider>
        <!-- chant-form-item -->
        <div
          v-else
          class="chant-form-item"
          :class="{ 'whole-box': isWhole(item) }">
          <el-form-item :prop="item.prop" :rules="rules(item)">
            <!-- label -->
            <template #label>
              <chant-tooltip :text="`${translate(item)}:`"></chant-tooltip>
            </template>
            <!-- slot -->
            <slot
              v-if="item.slotForm"
              :name="item.prop"
              :label="translate(item)"
              :row="item"
              :value="vModel!.form[item.prop]">
            </slot>
            <!-- input -->
            <el-input
              v-else-if="!item.type || item.type === 'input'"
              v-model="vModel!.form[item.prop]"
              :clearable="item.clearable !== false"
              :disabled="isDisabled(item)"
              :placeholder="translate(item, 'enter')"
              :rows="item.rows || 3"
              :type="item.inputType">
              <template v-if="item.prepend" #prepend>
                {{ gt(item.prepend) }}
              </template>
              <template v-else-if="item.append" #append>
                {{ gt(item.append) }}
              </template>
            </el-input>
            <!-- select -->
            <chant-select
              v-else-if="item.type === 'select'"
              v-model="vModel!.form[item.prop]"
              :clearable="item.clearable !== false"
              :disabled="isDisabled(item)"
              :data="props?.dict?.[item.prop]"
              :lang="lang"
              :multiple="item.selectMultiple"
              :placeholder="translate(item, 'select')"
              @change="onChange(item)">
            </chant-select>
            <!-- timepicker -->
            <el-time-picker
              v-else-if="item.type === 'time-picker'"
              v-model="vModel!.form[item.prop]"
              :clearable="item.clearable !== false"
              :disabled="isDisabled(item)"
              :placeholder="translate(item, 'select')"
              :value-format="item.valueFormat || 'HH:mm:ss'">
            </el-time-picker>
            <!-- date-picker -->
            <template v-else-if="item.type === 'date-picker'">
              <el-date-picker
                v-if="formUtils.isDateRange(item.datepickerType)"
                v-model="state.range[item.prop]"
                :clearable="item.clearable !== false"
                :disabled="isDisabled(item)"
                :disabled-date="disabledDate(item)"
                :placeholder="translate(item, 'select')"
                :start-placeholder="translate(item)"
                :end-placeholder="translate(item)"
                :type="item.datepickerType"
                :value-format="item.valueFormat"
                @change="onDateRangeChange(item)">
              </el-date-picker>
              <el-date-picker
                v-else
                v-model="vModel!.form[item.prop]"
                :clearable="item.clearable !== false"
                :disabled="isDisabled(item)"
                :disabled-date="disabledDate(item)"
                :placeholder="translate(item, 'select')"
                :type="item.datepickerType"
                :value-format="item.valueFormat">
              </el-date-picker>
            </template>
            <!-- input-number -->
            <el-input-number
              v-else-if="item.type === 'input-number'"
              v-model="vModel!.form[item.prop]"
              controls-position="right"
              :disabled="isDisabled(item)"
              :min="item.min"
              :max="item.max"
              :precision="item.precision"
              :placeholder="translate(item, 'enter')">
            </el-input-number>
            <!-- upload -->
            <chant-upload
              v-else-if="item.type === 'upload'"
              v-model="vModel!.form[item.prop]"
              :disabled="isDisabled(item)"
              :file-biz-type="item.fileBizType"
              :limit="item.limit"
              :multiple="item.multiple"
              :type="item.uploadType!">
            </chant-upload>
            <!-- range -->
            <div
              v-else-if="item.type === 'input-number-range'"
              class="input-range">
              <el-input-number
                v-model="vModel!.form[rangeField(item, 'start')]"
                controls-position="right"
                :disabled="isDisabled(item)"
                :placeholder="translate(item)">
              </el-input-number>
              <div class="connector">~</div>
              <el-input-number
                v-model="vModel!.form[rangeField(item, 'end')]"
                controls-position="right"
                :disabled="isDisabled(item)"
                :placeholder="translate(item)">
              </el-input-number>
            </div>
            <!-- radio -->
            <el-radio-group
              v-else-if="item.type === 'radio'"
              v-model="vModel!.form[item.prop]"
              :disabled="isDisabled(item)"
              :placeholder="translate(item, 'select')">
              <el-radio
                v-for="(val, key) in props.dict?.[item.prop]"
                :key="key"
                :label="key">
                {{ dictTranslate(val) }}
              </el-radio>
            </el-radio-group>
            <!-- custom-picker -->
            <dynamic-picker
              v-if="item.type === 'custom-picker'"
              v-model:id="vModel!.form[item.dynamicId || item.prop]"
              v-model:text="vModel!.form[item.dynamicText || item.prop]"
              :title="translate(item)"
              :type="item.customPicker!">
            </dynamic-picker>
            <!-- tips -->
            <el-tooltip
              v-if="item.tips"
              :content="t(item.tips)"
              placement="top">
              <chant-icon-font class="icon-query" icon="query">
              </chant-icon-font>
            </el-tooltip>
          </el-form-item>
        </div>
      </template>
      <slot></slot>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  base,
  formUtils,
  useAppStore,
  LangEnum,
  type FormColumn as Column,
  type Lang,
  type PageType
} from '@/chant'

// props
const props = defineProps<{
  dict?: any // 字典
  labelWidth?: string // label宽度
  lang?: Lang // 国际化
  columns?: Column[] // model
}>()
// emits
const emits = defineEmits(['instance'])
// model
const vModel = defineModel<{
  form: any
  pageType?: PageType
}>()
// use
const appStore = useAppStore()
const { t } = useI18n({ messages: props.lang })
const { t: gt } = useI18n({ useScope: 'global' })
// ref
const formRef = ref<FormInstance>()
// state
const state = reactive({
  range: {} as any
})
// computed
const availableColumns = computed(() => {
  return props.columns?.filter((item) => {
    if (item.hide) {
      return false
    }
    if (item.hideInPages?.includes(vModel.value?.pageType!)) {
      return false
    }
    if (item.showCustom) {
      return item?.showCustom(vModel.value)
    }
    return true
  })
})
const labelWidthCpd = computed(() => {
  if (props.labelWidth) {
    return props.labelWidth
  }
  const lang = appStore.state.lang
  const map = new Map([
    [LangEnum.En, '100px'],
    [LangEnum.Zh, '80px']
  ])
  return map.get(lang)
})
// onMounted
onMounted(() => {
  // 实例更新
  emits('instance', formRef.value)
  // 初始化
  init()
})
// 初始化
function init() {
  props.columns?.forEach((item) => {
    // 默认值
    if (item.default && vModel.value?.pageType !== 'edit') {
      vModel.value!.form[item.prop] = item.default
    }
    // date range
    if (formUtils.isDateRange(item.datepickerType)) {
      const start = rangeField(item, 'start')
      // watch
      watch(
        () => vModel.value!.form[start],
        () => {
          // daterange赋值
          dateRangeVoluation(item)
        }
      )
    }
  })
}
// daterange赋值
function dateRangeVoluation(column: Column) {
  const start = rangeField(column, 'start')
  const end = rangeField(column, 'end')
  const startTime = vModel.value!.form[start]
  const endTime = vModel.value!.form[end]
  if (startTime && endTime) {
    state.range[column.prop] = [startTime, endTime]
  }
  if (!startTime && !endTime) {
    state.range[column.prop] = [null, null]
  }
}
// 日期禁用
function disabledDate(column: Column) {
  return (date: Date) =>
    column?.disabledDate ? column?.disabledDate(date, vModel.value) : undefined
}
// 是否禁用
function isDisabled(row: Column) {
  if (typeof row.disabled === 'function') {
    return row.disabled(vModel.value!.form)
  }
  if (row.disabledInPage && row.disabledInPage === vModel.value?.pageType) {
    return true
  }
  return row.disabled
}
// 是否显示一整行
function isWhole(column: Column) {
  if (column.type === 'upload') {
    return true
  }
  if (column.inputType === 'textarea') {
    return true
  }
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
// 校验规则
function rules(column: Column) {
  const rules = column.rules || []
  if (column.required) {
    rules.push({
      required: true,
      message: base.i18nJoint([translate(column), gt('tips.required')])
    })
  }
  return rules
}
// change
function onChange(column: Column) {
  return column.change && column.change(vModel.value!.form)
}
// 日期范围选择
function onDateRangeChange(column: Column) {
  let value = state.range[column.prop]
  if (!value) {
    value = ['', '']
  }
  vModel.value!.form[rangeField(column, 'start')] = value[0]
  vModel.value!.form[rangeField(column, 'end')] = value[1]
}
// 翻译
function translate(column: Column, type?: 'enter' | 'select') {
  let label = column.label || column.prop || column.title!
  label = props.lang ? t(label) : label
  const map = {
    enter: gt('tips.enter'),
    select: gt('tips.select')
  }
  const tips = type ? map[type] : ''
  if (tips) {
    return base.i18nJoint([tips, label])
  } else {
    return label
  }
}
// 字典翻译
function dictTranslate(label: string) {
  return label.indexOf('dict.') >= 0 ? t(label) : label
}
</script>

<style lang="scss">
.chant-form {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 5px;
  overflow: auto;
  padding-right: 5px;
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item__label {
      padding-left: 5px;
    }
    .el-form-item__content {
      display: flex;
      align-items: center;
    }
    .el-input-number {
      width: 140px;
    }
    .el-select {
      flex: 1;
    }
    .el-date-editor {
      flex: 1;
    }
    .chant-picker-input {
      flex: 1;
    }
    .icon-query {
      color: var(--el-text-color-regular);
      font-size: 16px;
      margin-left: 3px;
    }
  }
  // range
  .input-range {
    display: flex;
    align-items: center;
    .connector {
      text-align: center;
      width: 32px;
    }
  }
}
@container (min-width: 0) {
  .chant-form-item {
    width: 100%;
  }
}
@container (min-width: 600px) {
  .chant-form-item {
    width: 50%;
    &.whole-box {
      width: 100%;
    }
  }
}
@container (min-width: 1000px) {
  .chant-form-item {
    width: 33.3333%;
    &.whole-box {
      width: 100%;
      .el-form-item {
        width: 66.6666%;
      }
    }
  }
}
@container (min-width: 1300px) {
  .chant-form-item {
    width: 25%;
    &.whole-box {
      width: 100%;
      .el-form-item {
        width: 50%;
      }
    }
  }
}
</style>
