<template>
  <el-select
    v-model="vModel"
    :clearable="props.clearable"
    collapse-tags
    :disabled="props.disabled"
    :multiple="props.multiple"
    :placeholder="props.placeholder"
    @change="emits('change')">
    <template v-if="props.multiple" #header>
      <el-checkbox
        v-model="checkAll"
        :indeterminate="indeterminate"
        style="width: 100%"
        @change="onCheckAll">
        {{ gt('button.selectAll') }}
      </el-checkbox>
    </template>
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.val"
      :value="item.key">
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Lang } from '@chant'

// type
type Option = { key: any; val: any }
// props
const props = defineProps<{
  clearable?: boolean
  disabled?: boolean
  data: Map<any, any> | Record<string, any>
  lang?: Lang
  multiple?: boolean
  placeholder?: string
}>()
// emits
const emits = defineEmits(['change'])
// vMdoel
const vModel = defineModel<any>()
// use
const { t } = useI18n({ messages: props.lang })
const { t: gt } = useI18n({ useScope: 'global' })
// ref
const checkAll = ref(false)
const indeterminate = ref(false)
// computed
const options = computed(() => {
  const data = props.data
  const list = [] as Option[]
  if (props.data instanceof Map) {
    data.forEach((val: any, key: any) => {
      list.push({ key, val: translate(val) })
    })
  } else {
    for (const item in data) {
      const val = (data as any)[item]
      list.push({ key: item, val: translate(val) })
    }
  }
  return list
})
// watch
watch(vModel, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === options.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})
// 全选
function onCheckAll(val: any) {
  indeterminate.value = false
  if (val) {
    vModel.value = options.value.map((item) => item.key)
  } else {
    vModel.value = []
  }
}
// 翻译
function translate(label: string) {
  return label.indexOf('dict.') >= 0 ? t(label) : label
}
</script>

<style lang="scss">
.el-select-dropdown__header {
  padding: 5px 10px;
}
</style>
