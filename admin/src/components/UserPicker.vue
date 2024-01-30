<template>
  <chant-picker-button
    v-bind="$attrs"
    v-model="visible"
    v-model:id="id"
    v-model:text="text"
    :placeholder="props.title"
    @clear="emits('change')">
  </chant-picker-button>
  <chant-table-picker
    v-if="visible"
    v-bind="$attrs"
    v-model="visible"
    api-path="user/list"
    :columns="columns()"
    :dict="dict"
    :title="props.title"
    @change="onChange">
  </chant-table-picker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { columns, dict } from '@/views/user/user-list/share'

// props
const props = defineProps<{
  title: string
}>()
// emits
const emits = defineEmits(['change'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
// ref
const visible = ref(false)

// change
function onChange(row: any) {
  id.value = row.id
  text.value = row.name
  emits('change')
}
</script>

<style scoped lang="scss"></style>
