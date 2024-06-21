<template>
  <!-- user-picker -->
  <user-picker
    v-if="props.type === 'user'"
    v-model:id="id"
    v-model:text="text"
    :disabled="props.disabled"
    :title="props.title"
    @change="emits('change', $event)">
  </user-picker>
  <!-- org-tree -->
  <org-tree-select v-model="id" @change="emits('change', $event)">
  </org-tree-select>
</template>

<script setup lang="ts">
import { type DynamicPicker } from 'chant'
import UserPicker from './UserPicker.vue'
import OrgTreeSelect from './OrgTreeSelect.vue'

// props
const props = defineProps<{
  disabled?: boolean
  title: string
  type: DynamicPicker
}>()
// emits
const emits = defineEmits(['change'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
</script>

<style scoped lang="scss"></style>
