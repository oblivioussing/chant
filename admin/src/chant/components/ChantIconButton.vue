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
  Link,
  Plus
} from '@element-plus/icons-vue'

// type
type IconType =
  | 'copyDocument'
  | 'delete'
  | 'document'
  | 'edit'
  | 'link'
  | 'plus'
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
    link: Link,
    plus: Plus
  }
  if (props.iconType) {
    return map[props.iconType]
  } else {
    return undefined
  }
})
</script>
<style scoped lang="scss"></style>
