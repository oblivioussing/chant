<template>
  <chant-picker-button
    v-bind="$attrs"
    v-model="visible"
    v-model:id="id"
    v-model:text="text"
    :placeholder="props.title"
    @clear="emits('change', {})">
  </chant-picker-button>
  <chant-table-picker
    v-if="visible"
    v-bind="$attrs"
    v-model="visible"
    :api-path="props.apiPath"
    :columns="props.columns"
    :columns-set="props.columnsSet"
    :dict="props.dict"
    :lang="props.lang"
    :title="props.title"
    @change="emits('change', $event)">
  </chant-table-picker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TablePickerProps } from '@chant/type'

// props
const props = defineProps<TablePickerProps>()
// emits
const emits = defineEmits(['change'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
// ref
const visible = ref(false)
</script>

<style scoped lang="scss"></style>
