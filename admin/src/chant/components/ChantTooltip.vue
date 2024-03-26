<template>
  <el-tooltip :content="props.text" :disabled="isDisabled" placement="top">
    <el-text ref="textRef" truncated>{{ props.text }}</el-text>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// props
const props = defineProps<{
  text: string
}>()
// ref
const textRef = ref()
// computed
const isDisabled = computed(() => {
  const el = textRef.value?.$el as HTMLElement
  return el?.offsetWidth >= el?.scrollWidth
})
</script>
