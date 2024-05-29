<template>
  <chant-base-picker
    v-model:id="id"
    v-model:text="text"
    v-bind="$attrs"
    api-path="user/list"
    :columns="columns()"
    :dict="dict"
    :lang="lang"
    @change="onChange">
  </chant-base-picker>
</template>

<script setup lang="ts">
import { columns, dict, lang } from '@app-base/views/auth/user/share'

// emits
const emits = defineEmits(['change'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
// change
function onChange(row: any) {
  id.value = row.id
  text.value = row.name
  emits('change', row)
}
</script>

<style scoped lang="scss"></style>
