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
  More,
  Plus,
  Sort
} from '@element-plus/icons-vue'

// type
type IconType =
  | 'copyDocument'
  | 'delete'
  | 'document'
  | 'edit'
  | 'link'
  | 'more'
  | 'plus'
  | 'sort'
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
    more: More,
    plus: Plus,
    sort: Sort
  }
  if (props.iconType) {
    return map[props.iconType]
  } else {
    return undefined
  }
})
</script>
<style scoped lang="scss"></style>
