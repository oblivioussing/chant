<template>
  <el-select
    v-model="vModel"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :multiple="props.multiple"
    :placeholder="props.placeholder"
    @change="emits('change')">
    <el-option v-for="item in options" :label="item.val" :value="item.key">
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// type
type Option = { key: any; val: any }
// props
const props = defineProps<{
  clearable?: boolean
  disabled?: boolean
  data: Map<any, any> | Record<string, any>
  multiple?: boolean
  placeholder?: string
}>()
// emits
const emits = defineEmits(['change'])
// vMdoel
const vModel = defineModel<any>()
// computed
const options = computed(() => {
  const data = props.data
  const list = [] as Option[]
  if (props.data instanceof Map) {
    data.forEach((val: any, key: any) => {
      list.push({ key, val })
    })
  } else {
    for (const item in data) {
      const val = (data as any)[item]
      list.push({ key: item, val })
    }
  }
  return list
})
</script>

<style scoped lang="scss"></style>
