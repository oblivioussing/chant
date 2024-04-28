<template>
  <el-select
    v-model="vModel"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :multiple="props.multiple"
    :placeholder="props.placeholder"
    @change="emits('change')">
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.val"
      :value="item.key">
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
// 翻译
function translate(label: string) {
  return label.indexOf('dict.') >= 0 ? t(label) : label
}
</script>

<style scoped lang="scss"></style>
