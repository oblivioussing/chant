<template>
  <chant-picker-button
    v-bind="$attrs"
    v-model="visible"
    v-model:id="id"
    v-model:text="text"
    placeholder="用户">
  </chant-picker-button>
  <chant-table-picker
    v-if="visible"
    v-bind="$attrs"
    v-model="visible"
    api-path="user/list"
    :columns="columns()"
    :dict="dict"
    title="用户"
    @change="onChange">
  </chant-table-picker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { columns, dict } from '@/views/user/user-list/share'

// emits
const emits = defineEmits(['update:id', 'update:text'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
// ref
const visible = ref(false)

// change
function onChange(row: any) {
  id.value = row.id
  text.value = row.name
}
</script>

<style scoped lang="scss"></style>
