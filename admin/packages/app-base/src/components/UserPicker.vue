<template>
  <chant-base-picker
    v-model:id="id"
    v-model:text="text"
    api-path="user/list"
    :columns="columns()"
    :dict="dict"
    :lang="lang"
    :title="props.title"
    @change="onChange">
  </chant-base-picker>
</template>

<script setup lang="ts">
import { user as lang } from '@app-base/lang'
import { columns, dict } from '@app-base/views/auth/user/share'

// props
const props = defineProps<{
  title: string
}>()
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
