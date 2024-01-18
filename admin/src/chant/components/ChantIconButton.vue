<template>
  <chant-button v-bind="$attrs" :icon="icon">
    <slot></slot>
  </chant-button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import {
  CopyDocument,
  Document,
  Delete,
  Edit,
  Plus
} from '@element-plus/icons-vue'

// type
type IconType = 'copyDocument' | 'delete' | 'document' | 'edit' | 'plus'
// props
const props = defineProps<{
  iconType?: IconType
}>()
// computed
const icon = computed(() => {
  const map = {
    copyDocument: CopyDocument,
    delete: Delete,
    document: Document,
    edit: Edit,
    plus: Plus
  }
  if (props.iconType) {
    return map[props.iconType]
  }
})
</script>
<style scoped lang="scss"></style>
